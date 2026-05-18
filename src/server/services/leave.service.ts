import { isOneYearPassed } from "@/lib/date-converter";
import { EmployeeJob, Leave, Setting } from "@/server/models/module.model";
import { PipelineStage } from "mongoose";

const getLeaveAllottedDays = async () => {
  const setting = await Setting.findOne().exec();
  if (!setting) throw new Error("Settings not found");
  const days: Record<string, number> = {};
  (setting.leaves ?? []).forEach((leave: { name: string; days: number }) => {
    days[leave.name] = leave.days;
  });
  return days;
};

export const getAllLeaveService = async (options: {
  page?: number;
  limit?: number;
  year?: string;
}) => {
  const { page = 1, limit = 10, year } = options;
  if (!year) throw new Error("Year is required");

  const parsedYear = parseInt(year);
  if (isNaN(parsedYear)) throw new Error("Year must be a valid number");

  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 ? limit : 10;
  const skip = (safePage - 1) * safeLimit;

  const matchCondition = {
    years: { $elemMatch: { year: parsedYear } },
    status: { $ne: "archived" },
  };

  const pipeline: PipelineStage[] = [
    { $match: matchCondition },
    { $sort: { employee_id: 1, _id: 1 } },
    { $skip: skip },
    { $limit: safeLimit },
    {
      $project: {
        _id: 0,
        employee_id: 1,
        yearData: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$years",
                as: "y",
                cond: { $eq: ["$$y.year", parsedYear] },
              },
            },
            0,
          ],
        },
      },
    },
  ];

  const result = await Leave.aggregate(pipeline);

  const transformedResult = result
    .filter((r: any) => r.yearData)
    .map((r: any) => ({
      employee_id: r.employee_id,
      year: r.yearData.year,
      casual: r.yearData.casual,
      earned: r.yearData.earned,
      sick: r.yearData.sick,
      without_pay: r.yearData.without_pay,
    }));

  const total = await Leave.countDocuments(matchCondition);
  return { result: transformedResult, meta: { total } };
};

export const getLeaveService = async (id: string) => {
  return Leave.findOne({ employee_id: id });
};

export const addNewYearLeaveService = async (year: number) => {
  if (!year || year < 1900 || year > 2100) {
    throw new Error("Valid year is required");
  }

  const existing = await Leave.findOne({ "years.year": year });
  if (existing) return { message: "Year data already exists" };

  const leaveAllottedDays = await getLeaveAllottedDays();
  const employees = await EmployeeJob.find({});
  if (employees.length === 0) throw new Error("No employees found");

  const employeeIds = employees.map((e: any) => e.employee_id);

  const prevYearDocs = await Leave.find(
    { employee_id: { $in: employeeIds }, "years.year": year - 1 },
    { employee_id: 1, years: 1, _id: 0 },
  ).lean();

  const prevYearMap = new Map<string, any>(
    prevYearDocs.map((doc: any) => [
      doc.employee_id,
      (doc.years ?? []).find((y: any) => y.year === year - 1),
    ]),
  );

  const yearStart = new Date(`01-01-${year}`);
  const bulkOperations: any[] = [];

  for (const employee of employees) {
    const newYearData = {
      year,
      casual: { allotted: leaveAllottedDays.casual ?? 0, consumed: 0 },
      sick: { allotted: leaveAllottedDays.sick ?? 0, consumed: 0 },
      earned: { allotted: leaveAllottedDays.earned ?? 0, consumed: 0 },
      without_pay: { allotted: leaveAllottedDays.without_pay ?? 0, consumed: 0 },
    };

    const permanentDate = new Date(employee.permanent_date);
    if (!isOneYearPassed(permanentDate, yearStart)) {
      newYearData.earned.allotted = 0;
    }

    const prevYear = prevYearMap.get(employee.employee_id);
    if (prevYear) {
      const carryOver = prevYear.earned.allotted - prevYear.earned.consumed;
      newYearData.earned.allotted += Math.max(0, carryOver);
    }

    bulkOperations.push({
      updateOne: {
        filter: { employee_id: employee.employee_id },
        update: { $push: { years: newYearData } },
        upsert: true,
      },
    });
  }

  await Leave.bulkWrite(bulkOperations);
  return { message: "Year data added successfully" };
};

export const updateLeaveService = async (
  id: string,
  year: number,
  updateData: any,
) => {
  if (!id || !year || !updateData) {
    throw new Error("Employee ID, year, and update data are required");
  }

  const result = await Leave.findOneAndUpdate(
    { employee_id: id, "years.year": year },
    { $set: { "years.$": updateData } },
    { returnDocument: "after" },
  );

  if (!result) throw new Error("Leave record not found");
  return result;
};

export const deleteLeaveService = async (id: string) => {
  if (!id) throw new Error("Employee ID is required");
  const result = await Leave.findOneAndDelete({ employee_id: id });
  if (!result) throw new Error("Leave record not found");
  return result;
};
