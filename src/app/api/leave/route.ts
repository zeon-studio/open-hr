import { withDb } from "@/app/api/_lib/handler";
import { ENUM_ROLE } from "@/enums/roles";
import { withApiAuth } from "@/server/auth/api-auth";
import { getAllLeaveService } from "@/server/services/leave.service";
import { apiSuccess } from "@/server/utils/api-response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return withDb(async () => {
    const { error } = await withApiAuth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR);
    if (error) return error;

    const { searchParams } = req.nextUrl;
    const result = await getAllLeaveService({
      page: Number(searchParams.get("page") ?? 1),
      limit: Number(searchParams.get("limit") ?? 10),
      year: searchParams.get("year") ?? undefined,
    });

    return apiSuccess(result.result, "success", result.meta);
  });
}
