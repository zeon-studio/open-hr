import variables from "@/config/variables";
import { localDate } from "@/lib/date-converter";
import { dayCounter } from "@/lib/leaveHelper";
import { Employee } from "@/server/models/employee.model";
import { EmployeeJob, Leave, LeaveRequest } from "@/server/models/module.model";
import { leaveRequestDiscord, mailSender } from "@/server/mail/mail-sender";
import mongoose, { PipelineStage } from "mongoose";

const leaveValidator = async (data: {
  leave_type: string;
  employee_id: string;
  start_date: Date;
  end_date: Date;
}) => {
  const { leave_type, employee_id, start_date, end_date } = data;
  const leaveTypes = ["casual", "earned", "sick", "without_pay"];
  if (!leaveTypes.includes(leave_type)) throw new Error("Invalid leave type");

  const year = start_date.getFullYear();
  const leaveData = await Leave.findOne(
    { employee_id, "years.year": year },
    { years: 1, _id: 0 },
  ).exec();

  if (!leaveData) {
    throw new Error(`No leave data found for employee ${employee_id} in ${year}`);
  }

  const yearData = leaveData.years.find((y: any) => y.year === year);
  if (!yearData) throw new Error(`Leave data for year ${year} not found`);

  const overlapping = await LeaveRequest.findOne({
    employee_id,
    status: { $in: ["approved", "pending"] },
    $or: [
      { start_date: { $lte: end_date }, end_date: { $gte: start_date } },
    ],
  });

  if (overlapping) {
    throw new Error(
      `Leave request overlaps with an existing leave from ${overlapping.start_date} to ${overlapping.end_date}`,
    );
  }

  return yearData;
};

export const getAllLeaveRequestService = async (options: {
  page?: number;
  limit?: number;
  search?: string;
  employee_id?: string;
}) => {
  const { page = 1, limit = 10, search, employee_id } = options;
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 ? limit : 10;
  const skip = (safePage - 1) * safeLimit;

  const matchCondition: any = {};
  if (search) {
    const keywords = String(search).replace(/\+/g, " ").split("|");
    matchCondition.$or = keywords.map((kw) => ({
      $or: [
        { employee_id: { $regex: kw, $options: "i" } },
        { reason: { $regex: kw, $options: "i" } },
      ],
    }));
  }
  if (employee_id) matchCondition.employee_id = employee_id;

  const pipeline: PipelineStage[] = [
    { $match: matchCondition },
    {
      $addFields: {
        isPending: { $cond: { if: { $eq: ["$status", "pending"] }, then: 1, else: 0 } },
      },
    },
    { $sort: { isPending: -1, createdAt: -1 } },
    { $project: { isPending: 0 } },
    { $skip: skip },
    { $limit: safeLimit },
    {
      $project: {
        _id: 1,
        employee_id: 1,
        leave_type: 1,
        start_date: 1,
        end_date: 1,
        day_count: 1,
        reason: 1,
        status: 1,
      },
    },
  ];

  const [result, total] = await Promise.all([
    LeaveRequest.aggregate(pipeline),
    LeaveRequest.countDocuments(matchCondition),
  ]);
  return { result, meta: { total } };
};

export const getLeaveRequestService = async (id: string) => {
  return LeaveRequest.find({ employee_id: id }).sort({ createdAt: -1 });
};

export const createLeaveRequestService = async (data: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const startDate = localDate(new Date(data.start_date));
    const endDate = localDate(new Date(data.end_date));
    const dayCount = await dayCounter(startDate, endDate);

    const enrichedData = { ...data, start_date: startDate, end_date: endDate, day_count: dayCount };

    const yearData = await leaveValidator(enrichedData);
    const consumedDays = yearData[data.leave_type].consumed;
    const allottedDays = yearData[data.leave_type].allotted;

    if (consumedDays + dayCount > allottedDays) {
      throw new Error(
        `You have exceeded the maximum number of ${data.leave_type} days for this year`,
      );
    }

    const postData = new LeaveRequest(enrichedData);
    await postData.save({ session });

    const currentYear = startDate.getFullYear();
    await Leave.findOneAndUpdate(
      { employee_id: data.employee_id, "years.year": currentYear },
      { $inc: { [`years.$.${data.leave_type}.consumed`]: dayCount } },
      { session },
    );

    const [employeeData, employeeJobData, adminAndModData] = await Promise.all([
      Employee.findOne({ id: data.employee_id }).session(session).lean(),
      EmployeeJob.findOne({ employee_id: data.employee_id }).session(session).lean(),
      Employee.find({ role: { $in: ["admin", "moderator"] } }, { work_email: 1 }).session(session).lean(),
    ]);
    const managerData = employeeJobData?.manager_id
      ? await Employee.findOne({ id: employeeJobData.manager_id }, { work_email: 1 }).session(session).lean()
      : null;

    const notifyEmails = [
      ...adminAndModData.map((e: any) => e.work_email).filter(Boolean),
      managerData?.work_email,
    ].filter(Boolean) as string[];

    await mailSender.leaveRequest(
      notifyEmails,
      employeeData?.name ?? data.employee_id,
      data.leave_type,
      dayCount,
      startDate,
      endDate,
      data.reason,
    );

    if (variables.discord_webhook_url) {
      try {
        await fetch(variables.discord_webhook_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: leaveRequestDiscord(
              employeeData?.name ?? data.employee_id,
              data.leave_type,
              dayCount,
              startDate,
              endDate,
              data.reason,
            ),
          }),
        });
      } catch (e: any) {
        if (e?.status !== 429) console.warn("Discord notification failed:", e?.message);
      }
    }

    await session.commitTransaction();
    return postData;
  } catch (error: any) {
    await session.abortTransaction();
    throw new Error(error.message);
  } finally {
    session.endSession();
  }
};

export const updateLeaveRequestService = async (id: string, updateData: any) => {
  const leaveReqData = await LeaveRequest.findOne({ _id: id });
  if (!leaveReqData) throw new Error("Leave request not found");

  const employeeData = await Employee.findOne({ id: leaveReqData.employee_id });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (updateData.status === "rejected") {
      const currentYear = leaveReqData.start_date.getFullYear();
      await Leave.findOneAndUpdate(
        { employee_id: leaveReqData.employee_id, "years.year": currentYear },
        { $inc: { [`years.$.${leaveReqData.leave_type}.consumed`]: -leaveReqData.day_count } },
        { session },
      );
    }

    await mailSender.leaveRequestResponse(
      employeeData?.work_email ?? "",
      employeeData?.name ?? leaveReqData.employee_id,
      leaveReqData.leave_type,
      leaveReqData.day_count,
      leaveReqData.start_date,
      leaveReqData.end_date,
      leaveReqData.reason,
      updateData.status,
    );

    const result = await LeaveRequest.findOneAndUpdate(
      { _id: id },
      updateData,
      { returnDocument: "after", session },
    );

    await session.commitTransaction();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    throw new Error(error.message);
  } finally {
    session.endSession();
  }
};

export const deleteLeaveRequestService = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const leaveReqData = await LeaveRequest.findOne({ _id: id }).session(session);
    if (!leaveReqData) throw new Error("Leave request not found");

    const currentYear = leaveReqData.start_date.getFullYear();
    await Leave.findOneAndUpdate(
      { employee_id: leaveReqData.employee_id, "years.year": currentYear },
      { $inc: { [`years.$.${leaveReqData.leave_type}.consumed`]: -leaveReqData.day_count } },
      { session },
    );

    await LeaveRequest.findOneAndDelete({ _id: id, status: "pending" }).session(session);

    await session.commitTransaction();
  } catch (error: any) {
    await session.abortTransaction();
    throw new Error(error.message);
  } finally {
    session.endSession();
  }
};

export const getUpcomingLeaveRequestService = async (currentDate: Date) => {
  return LeaveRequest.find({
    status: { $in: ["approved", "pending"] },
    end_date: { $gte: currentDate },
  }).sort({ start_date: 1 });
};

export const getUpcomingLeaveRequestDatesService = async (currentDate: Date) => {
  const requests = await LeaveRequest.find({
    status: { $in: ["approved", "pending"] },
    start_date: { $gte: currentDate },
  });

  return requests
    .map((req: any) => {
      const dates: Date[] = [];
      const cursor = new Date(req.start_date);
      const end = new Date(req.end_date);
      while (cursor <= end) {
        dates.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
      return dates;
    })
    .flat();
};
