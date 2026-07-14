import { apiError, apiSuccess } from "@/server/utils/api-response";
import {
  createDocument,
  listDocuments,
  upsertByField,
} from "@/server/services/module.service";
import { patchEmployeeService } from "@/server/services/employee.service";
import { Setting } from "@/server/models/module.model";
import { ENUM_ROLE } from "@/enums/roles";
import { NextRequest } from "next/server";
import { withDb } from "../_lib/handler";
import { getModel, listSearchFields, VALID_MODULES } from "./_lib/model-map";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ module: string }> },
) {
  return withDb(async () => {
    const { module: moduleName } = await context.params;

    if (!VALID_MODULES.includes(moduleName)) {
      return apiError("Route not found", 404);
    }

    const model = getModel(moduleName);
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const employee_id = searchParams.get("employee_id") || "";
    const year = searchParams.get("year") || "";

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
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ module: string }> },
) {
  return withDb(async () => {
    const { module: moduleName } = await context.params;

    if (!VALID_MODULES.includes(moduleName)) {
      return apiError("Route not found", 404);
    }

    const model = getModel(moduleName);
    const body = await request.json().catch(() => ({}));

    if (moduleName === "employee-offboarding") {
      const setting = await Setting.findOne({})
        .sort({ createdAt: -1 })
        .lean<{ offboarding_tasks?: { name: string; assigned_to: string }[] }>();
      const tasks = (setting?.offboarding_tasks || []).map((task) => ({
        task_name: task.name,
        assigned_to: task.assigned_to,
        status: "pending",
      }));

      const created = await upsertByField(model, "employee_id", body.employee_id, {
        employee_id: body.employee_id,
        resignation_date: body.resignation_date,
        tasks,
      });
      await patchEmployeeService(body.employee_id, { role: ENUM_ROLE.FORMER });
      return apiSuccess(created, "data inserted successfully");
    }

    const created = await createDocument(model, body);
    return apiSuccess(created, "data inserted successfully");
  });
}
