import { ENUM_ROLE } from "@/enums/roles";
import { withApiAuth } from "@/server/auth/api-auth";
import { apiSuccess } from "@/server/utils/api-response";
import {
  createEmployeeService,
  getEmployeesService,
} from "@/server/services/employee.service";
import { NextRequest } from "next/server";
import { withDb } from "../_lib/handler";

export async function GET(request: NextRequest) {
  return withDb(async () => {
    const authResult = await withApiAuth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR);
    if (authResult.error) return authResult.error;

    const data = await getEmployeesService(request.nextUrl.searchParams);
    return apiSuccess(data.result, "data get successfully", data.meta);
  });
}

export async function POST(request: NextRequest) {
  return withDb(async () => {
    const authResult = await withApiAuth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR);
    if (authResult.error) return authResult.error;

    const body = await request.json().catch(() => ({}));
    const created = await createEmployeeService(body);
    return apiSuccess(created, "data inserted successfully");
  });
}
