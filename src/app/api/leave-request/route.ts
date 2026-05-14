import { withDb } from "@/app/api/_lib/handler";
import { withApiAuth } from "@/server/auth/api-auth";
import { ENUM_ROLE } from "@/enums/roles";
import {
  createLeaveRequestService,
  getAllLeaveRequestService,
} from "@/server/services/leave-request.service";
import { apiSuccess } from "@/server/utils/api-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return withDb(async () => {
    const { error } = await withApiAuth(
      ENUM_ROLE.ADMIN,
      ENUM_ROLE.MODERATOR,
      ENUM_ROLE.USER,
      ENUM_ROLE.FORMER,
    );
    if (error) return error;

    const { searchParams } = req.nextUrl;
    const result = await getAllLeaveRequestService({
      page: Number(searchParams.get("page") ?? 1),
      limit: Number(searchParams.get("limit") ?? 10),
      search: searchParams.get("search") ?? undefined,
      employee_id: searchParams.get("employee_id") ?? undefined,
    });

    return apiSuccess(result.result, "success", result.meta);
  });
}

export async function POST(req: Request) {
  return withDb(async () => {
    const { error } = await withApiAuth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER);
    if (error) return error;

    const body = await req.json();
    const result = await createLeaveRequestService(body);
    return apiSuccess(result);
  });
}
