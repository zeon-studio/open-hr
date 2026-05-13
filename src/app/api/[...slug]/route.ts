import { ENUM_ROLE } from "@/enums/roles";
import { withApiAuth } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/lib/apiResponse";
import { connectMongoose } from "@/lib/mongoose";
import {
  Asset,
  Calendar,
  Course,
  EmployeeAchievement,
  EmployeeBank,
  EmployeeContact,
  EmployeeDocument,
  EmployeeEducation,
  EmployeeJob,
  EmployeeOffboarding,
  EmployeeOnboarding,
  Leave,
  LeaveRequest,
  Payroll,
  Setting,
  Tool,
} from "@/models/module.model";
import {
  issueInviteTokenService,
  resetPasswordService,
  updatePasswordService,
  verifyOtpService,
  verifyUserService,
} from "@/modules/services/authentication.service";
import {
  createEmployeeService,
  deleteEmployeeService,
  getAdminAndModsService,
  getEmployeeBasicsService,
  getEmployeeByInviteTokenService,
  getEmployeeService,
  getEmployeesService,
  patchEmployeePasswordService,
  patchEmployeeService,
} from "@/modules/services/employee.service";
import {
  createDocument,
  deleteByFields,
  getByIdOrField,
  listDocuments,
  upsertByField,
} from "@/modules/services/module.service";
import { NextRequest } from "next/server";

const modelMap: Record<string, any> = {
  "employee-achievement": EmployeeAchievement,
  "employee-bank": EmployeeBank,
  "employee-contact": EmployeeContact,
  "employee-document": EmployeeDocument,
  "employee-education": EmployeeEducation,
  "employee-job": EmployeeJob,
  "employee-offboarding": EmployeeOffboarding,
  "employee-onboarding": EmployeeOnboarding,
  leave: Leave,
  "leave-request": LeaveRequest,
  payroll: Payroll,
  asset: Asset,
  calendar: Calendar,
  course: Course,
  tool: Tool,
};

const listSearchFields: Record<string, string[]> = {
  "employee-achievement": ["employee_id", "achievements.title"],
  "employee-bank": ["employee_id", "account_name", "bank_name"],
  "employee-contact": ["employee_id", "phone", "email"],
  "employee-document": ["employee_id", "documents.name"],
  "employee-education": ["employee_id", "degree", "institute"],
  "employee-job": ["employee_id", "designation", "department"],
  "employee-offboarding": ["employee_id"],
  "employee-onboarding": ["employee_id"],
  leave: ["employee_id"],
  "leave-request": ["employee_id", "reason"],
  payroll: ["employee_id"],
  asset: ["asset_id", "employee_id", "name"],
  calendar: ["year"],
  course: ["employee_id", "course_name"],
  tool: ["employee_id", "tool_name"],
};

const requireRoles = async (
  ...roles: (typeof ENUM_ROLE)[keyof typeof ENUM_ROLE][]
) => {
  const result = await withApiAuth(...roles);
  if (result.error) {
    return result;
  }
  return result;
};

const parseBody = async (request: NextRequest) => {
  try {
    return await request.json();
  } catch {
    return {};
  }
};

const handleEmployee = async (request: NextRequest, rest: string[]) => {
  const method = request.method;
  const searchParams = request.nextUrl.searchParams;

  if (method === "GET" && rest.length === 0) {
    const authResult = await requireRoles(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR);
    if (authResult.error) return authResult.error;

    const data = await getEmployeesService(searchParams);
    return apiSuccess(data.result, "data get successfully", data.meta);
  }

  if (method === "POST" && rest.length === 0) {
    const authResult = await requireRoles(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR);
    if (authResult.error) return authResult.error;

    const body = await parseBody(request);
    const created = await createEmployeeService(body);
    return apiSuccess(created, "data inserted successfully");
  }

  if (method === "GET" && rest[0] === "basics") {
    const authResult = await requireRoles(
      ENUM_ROLE.ADMIN,
      ENUM_ROLE.MODERATOR,
      ENUM_ROLE.USER,
    );
    if (authResult.error) return authResult.error;

    const data = await getEmployeeBasicsService();
    return apiSuccess(data, "data get successfully");
  }

  if (method === "GET" && rest[0] === "admin-and-mods") {
    const authResult = await requireRoles(ENUM_ROLE.ADMIN);
    if (authResult.error) return authResult.error;

    const data = await getAdminAndModsService();
    return apiSuccess(data, "employee get successfully");
  }

  if (method === "GET" && rest[0] === "invite-token" && rest[1]) {
    const data = await getEmployeeByInviteTokenService(rest[1]);
    return apiSuccess(data, "employee get successfully");
  }

  if (method === "GET" && rest.length === 1) {
    const authResult = await requireRoles(
      ENUM_ROLE.ADMIN,
      ENUM_ROLE.MODERATOR,
      ENUM_ROLE.USER,
      ENUM_ROLE.FORMER,
    );
    if (authResult.error) return authResult.error;

    const data = await getEmployeeService(rest[0]);
    return apiSuccess(data, "employee get successfully");
  }

  if (method === "PATCH" && rest[0] === "update" && rest[1]) {
    const body = await parseBody(request);
    const data = await patchEmployeeService(rest[1], body);
    return apiSuccess(data, "data updated successfully");
  }

  if (method === "PATCH" && rest[0] === "email" && rest[1]) {
    const body = await parseBody(request);
    const data = await patchEmployeeService(rest[1], {
      work_email: body.email,
    });
    return apiSuccess(data, "data updated successfully");
  }

  if (method === "PATCH" && rest[0] === "password" && rest[1]) {
    const body = await parseBody(request);
    const data = await patchEmployeePasswordService(rest[1], body.password);
    return apiSuccess(data, "data updated successfully");
  }

  if (method === "PATCH" && rest[0] === "communication_id" && rest[1]) {
    const body = await parseBody(request);
    const data = await patchEmployeeService(rest[1], {
      communication_id: body.communication_id,
    });
    return apiSuccess(data, "data updated successfully");
  }

  if (method === "PATCH" && rest[0] === "personality" && rest[1]) {
    const body = await parseBody(request);
    const data = await patchEmployeeService(rest[1], {
      personality: body.personality,
    });
    return apiSuccess(data, "data updated successfully");
  }

  if (method === "PATCH" && rest[0] === "role" && rest[1]) {
    const authResult = await requireRoles(ENUM_ROLE.ADMIN);
    if (authResult.error) return authResult.error;
    const body = await parseBody(request);
    const data = await patchEmployeeService(rest[1], { role: body.role });
    return apiSuccess(data, "data updated successfully");
  }

  if (method === "DELETE" && rest.length === 1) {
    const authResult = await requireRoles(ENUM_ROLE.ADMIN);
    if (authResult.error) return authResult.error;

    const data = await deleteEmployeeService(rest[0]);
    return apiSuccess(data, "data deleted successfully");
  }

  return apiError("Route not found", 404);
};

const handleAuthentication = async (request: NextRequest, rest: string[]) => {
  const body = await parseBody(request);

  if (request.method === "POST" && rest[0] === "verify-user") {
    const user = await verifyUserService(body.email);
    return apiSuccess(user, "verification token sent successfully");
  }

  if (request.method === "POST" && rest[0] === "verify-otp") {
    await verifyOtpService(body.email, body.otp);
    return apiSuccess(true, "token verified successfully");
  }

  if (request.method === "POST" && rest[0] === "verify-token") {
    await verifyOtpService(body.email, body.otp || body.token);
    return apiSuccess(true, "token verified successfully");
  }

  if (request.method === "POST" && rest[0] === "resend-otp") {
    const user = await verifyUserService(body.email);
    return apiSuccess(user, "verification token sent successfully");
  }

  if (request.method === "PATCH" && rest[0] === "recovery-password") {
    const updated = await resetPasswordService(
      body.email,
      body.password,
      body.reset_token,
    );
    return apiSuccess(updated, "password reset successfully");
  }

  if (request.method === "POST" && rest[0] === "reset-password") {
    const updated = await resetPasswordService(
      body.email,
      body.password,
      body.reset_token,
    );
    return apiSuccess(updated, "password reset successfully");
  }

  if (request.method === "PATCH" && rest[0] === "update-password") {
    const authResult = await requireRoles(
      ENUM_ROLE.ADMIN,
      ENUM_ROLE.MODERATOR,
      ENUM_ROLE.USER,
    );
    if (authResult.error) return authResult.error;

    const sessionUser = authResult.session?.user;
    const targetId = body.id || sessionUser?.id;
    if (!targetId) {
      return apiError("Employee id is required", 400);
    }

    if (
      sessionUser?.role === ENUM_ROLE.USER &&
      sessionUser.id &&
      sessionUser.id !== targetId
    ) {
      return apiError("User is not authenticated", 403);
    }

    await updatePasswordService(
      targetId,
      body.current_password,
      body.new_password,
    );
    return apiSuccess(true, "password updated successfully");
  }

  if (request.method === "POST" && rest[0] === "invite-token") {
    const token = await issueInviteTokenService(body.email);
    return apiSuccess({ invite_token: token }, "invite token generated");
  }

  return apiError("Route not found", 404);
};

const handleSetting = async (request: NextRequest, rest: string[]) => {
  if (request.method === "GET" && rest.length === 0) {
    const setting = await Setting.findOne({}).sort({ createdAt: -1 }).lean();
    return apiSuccess(setting || {}, "data get successfully");
  }

  if (request.method === "PATCH" && rest.length === 0) {
    const body = await parseBody(request);
    const setting = await Setting.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true },
    );
    return apiSuccess(setting, "data updated successfully");
  }

  if (request.method === "PATCH" && rest[0] === "update-module") {
    const body = await parseBody(request);
    const setting = await Setting.findOneAndUpdate(
      {},
      { $set: { modules: body.modules || [] } },
      { new: true, upsert: true },
    );
    return apiSuccess(setting, "data updated successfully");
  }

  return apiError("Route not found", 404);
};

const handleBucket = async (request: NextRequest, rest: string[]) => {
  if (request.method === "POST" && rest[0] === "upload") {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = String(formData.get("folder") || "misc");
    const fileName = file?.name || `file-${Date.now()}`;
    const key = `${folder}/${Date.now()}-${fileName}`;

    return apiSuccess({ key }, "file uploaded successfully");
  }

  if (request.method === "GET" && rest[0] === "download" && rest[1]) {
    const key = decodeURIComponent(rest.slice(1).join("/"));
    const base =
      process.env.BUCKET_URL || process.env.NEXT_PUBLIC_BUCKET_URL || "";
    return Response.json({ url: `${base}/${key}` });
  }

  if (request.method === "DELETE" && rest[0] === "delete" && rest[1]) {
    return apiSuccess(true, "File deleted successfully");
  }

  if (request.method === "POST" && rest[0] === "presigned") {
    const body = await parseBody(request);
    const key = String(body.key || `uploads/${Date.now()}`);
    const base =
      process.env.BUCKET_URL || process.env.NEXT_PUBLIC_BUCKET_URL || "";

    return apiSuccess(
      {
        key,
        uploadUrl: `${base}/${key}`,
      },
      "presigned url generated",
    );
  }

  return apiError("Route not found", 404);
};

const handleGenericModule = async (
  request: NextRequest,
  moduleName: string,
  rest: string[],
) => {
  const model = modelMap[moduleName];
  if (!model) {
    return apiError("Route not found", 404);
  }

  const method = request.method;

  if (method === "GET" && rest.length === 0) {
    const page = Number(request.nextUrl.searchParams.get("page") || 1);
    const limit = Number(request.nextUrl.searchParams.get("limit") || 10);
    const search = request.nextUrl.searchParams.get("search") || "";
    const employee_id = request.nextUrl.searchParams.get("employee_id") || "";
    const year = request.nextUrl.searchParams.get("year") || "";

    const extraFilter: Record<string, unknown> = {};
    if (employee_id) extraFilter.employee_id = employee_id;
    if (year) extraFilter.year = Number(year) || year;

    const data = await listDocuments(model, {
      page,
      limit,
      search,
      searchFields: listSearchFields[moduleName] || ["employee_id"],
      extraFilter,
    });

    return apiSuccess(data.result, "data get successfully", data.meta);
  }

  if (method === "GET" && rest[0] === "pending-task") {
    const data = await model.find({ "tasks.status": "pending" });
    return apiSuccess(data, "data get successfully");
  }

  if (method === "GET" && rest[0] === "upcoming" && rest[1]) {
    const date = new Date(rest[1]);
    const data = await model.find({ start_date: { $gte: date } }).limit(20);
    return apiSuccess(data, "data get successfully");
  }

  if (method === "GET" && rest[0] === "upcoming-dates" && rest[1]) {
    const date = new Date(rest[1]);
    const data = await model.find(
      { start_date: { $gte: date } },
      { start_date: 1 },
    );
    return apiSuccess(data, "data get successfully");
  }

  if (method === "GET" && rest[0] === "user" && rest[1]) {
    const data = await model.find({ employee_id: rest[1] });
    return apiSuccess(data, "data get successfully");
  }

  if (method === "GET" && rest[0] === "basics" && moduleName === "payroll") {
    const data = await model.find(
      {},
      { _id: 0, employee_id: 1, gross_salary: 1, status: 1 },
    );
    return apiSuccess(data, "data get successfully");
  }

  if (method === "GET" && rest.length === 1) {
    const idFields = ["_id", "employee_id", "asset_id", "year"];
    const data = await getByIdOrField(model, rest[0], idFields);
    return apiSuccess(data, "data get successfully");
  }

  if (method === "POST" && rest.length === 0) {
    const body = await parseBody(request);
    const created = await createDocument(model, body);
    return apiSuccess(created, "data inserted successfully");
  }

  if (method === "PATCH" && rest[0] === "task" && rest[1] && rest[2]) {
    const updated = await model.findOneAndUpdate(
      { employee_id: rest[1], "tasks.task_name": decodeURIComponent(rest[2]) },
      { $set: { "tasks.$.status": "done" } },
      { new: true },
    );
    return apiSuccess(updated, "data updated successfully");
  }

  if (
    method === "PATCH" &&
    rest[0] === "update-year" &&
    moduleName === "leave" &&
    rest[1]
  ) {
    const year = Number(rest[1]);
    const updated = await model.updateMany(
      {},
      {
        $push: {
          years: {
            year,
            casual: { allotted: 0, consumed: 0 },
            sick: { allotted: 0, consumed: 0 },
            earned: { allotted: 0, consumed: 0 },
            without_pay: { allotted: 0, consumed: 0 },
          },
        },
      },
    );
    return apiSuccess(updated, "data updated successfully");
  }

  if (method === "PATCH" && rest.length === 2 && moduleName === "leave") {
    const body = await parseBody(request);
    const updated = await upsertByField(model, "employee_id", rest[0], body);
    return apiSuccess(updated, "data updated successfully");
  }

  if (method === "PATCH" && rest.length === 1) {
    const body = await parseBody(request);

    let keyField = "employee_id";
    if (["asset"].includes(moduleName)) keyField = "asset_id";
    if (["course", "tool", "leave-request", "calendar"].includes(moduleName)) {
      keyField = "_id";
    }
    if (moduleName === "payroll") keyField = "employee_id";

    const updated = await upsertByField(model, keyField, rest[0], body);
    return apiSuccess(updated, "data updated successfully");
  }

  if (
    method === "DELETE" &&
    moduleName === "employee-document" &&
    rest.length === 2
  ) {
    const updated = await model.findOneAndUpdate(
      { employee_id: rest[0] },
      { $pull: { documents: { _id: rest[1] } } },
      { new: true },
    );
    return apiSuccess(updated, "data deleted successfully");
  }

  if (method === "DELETE" && rest.length === 1) {
    const deleted =
      (await deleteByFields(model, { _id: rest[0] })) ||
      (await deleteByFields(model, { employee_id: rest[0] })) ||
      (await deleteByFields(model, { asset_id: rest[0] })) ||
      (await deleteByFields(model, { year: Number(rest[0]) || rest[0] }));

    return apiSuccess(deleted, "data deleted successfully");
  }

  return apiError("Route not found", 404);
};

const handleRequest = async (
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) => {
  try {
    await connectMongoose();
    const { slug } = await context.params;

    if (!slug?.length) {
      return apiError("Route not found", 404);
    }

    const [moduleName, ...rest] = slug;

    if (moduleName === "employee") {
      return await handleEmployee(request, rest);
    }

    if (moduleName === "authentication") {
      return await handleAuthentication(request, rest);
    }

    if (moduleName === "setting") {
      return await handleSetting(request, rest);
    }

    if (moduleName === "bucket") {
      return await handleBucket(request, rest);
    }

    return await handleGenericModule(request, moduleName, rest);
  } catch (error) {
    return apiError(
      error instanceof Error ? error.message : "Internal server error",
      500,
    );
  }
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) {
  return handleRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) {
  return handleRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) {
  return handleRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) {
  return handleRequest(request, context);
}
