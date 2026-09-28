import { ENUM_ROLE } from "@/enums/roles";
import { Employee } from "@/server/models/employee.model";
import {
  issueInviteTokenService,
  verifyInviteToken,
} from "@/server/services/authentication.service";
import { generateEmployeeId } from "@/server/utils/id-generator";
import bcrypt from "bcrypt";

export const getEmployeesService = async (query: URLSearchParams) => {
  const page = Number(query.get("page") || 1);
  const limit = Number(query.get("limit") || 10);
  const search = query.get("search") || "";
  const status = query.get("status") || "";

  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { work_email: { $regex: search, $options: "i" } },
    ];
  }
  if (status) {
    filter.status = { $in: status.split(",") };
  }

  const skip = (page - 1) * limit;
  const [result, total] = await Promise.all([
    Employee.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Employee.countDocuments(filter),
  ]);

  return { result, meta: { total } };
};

export const getEmployeeBasicsService = async () => {
  return Employee.find(
    {},
    {
      _id: 0,
      id: 1,
      name: 1,
      work_email: 1,
      department: 1,
      designation: 1,
      role: 1,
    },
  );
};

export const getAdminAndModsService = async () => {
  return Employee.find({
    role: { $in: [ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR] },
  });
};

export const getEmployeeByInviteTokenService = async (token: string) => {
  const decoded = verifyInviteToken(token);
  return Employee.findOne({ id: decoded.id });
};

export const getEmployeeService = async (id: string) => {
  return Employee.findOne({ id });
};

// Employee IDs are `<prefix><DEPT><joining year><serial>`, e.g. TFADM2026004.
// The 3-digit serial runs per department across years; use the highest
// existing one (not a count) so removed employees never cause reuse.
const nextEmployeeId = async (department: string, joiningDate: unknown) => {
  const employees = await Employee.find({ department })
    .select({ id: 1 })
    .lean<{ id?: string }[]>();
  const maxSerial = employees.reduce((max, { id }) => {
    const match = id?.match(/\d{4}(\d{3,})$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  const joined = new Date(String(joiningDate));
  return generateEmployeeId(
    department,
    Number.isNaN(joined.getTime()) ? new Date() : joined,
    maxSerial + 1,
  );
};

export const createEmployeeService = async (
  payload: Record<string, unknown>,
) => {
  if (!payload.id) {
    payload.id = await nextEmployeeId(
      String(payload.department || ""),
      payload.joining_date,
    );
  }

  const inviteToken = await issueInviteTokenService(
    String(payload.work_email || payload.personal_email || ""),
  ).catch(() => null);

  const created = await Employee.create(payload);
  return { ...created.toObject(), inviteToken };
};

export const patchEmployeeService = async (
  id: string,
  payload: Record<string, unknown>,
) => {
  return Employee.findOneAndUpdate({ id }, { $set: payload }, { new: true });
};

export const patchEmployeePasswordService = async (
  id: string,
  password: string,
) => {
  const salt = Number(process.env.SALT_ROUND || 10);
  const hashed = await bcrypt.hash(password, salt);
  return Employee.findOneAndUpdate(
    { id },
    { $set: { password: hashed } },
    { new: true },
  );
};

export const deleteEmployeeService = async (id: string) => {
  return Employee.findOneAndDelete({ id });
};
