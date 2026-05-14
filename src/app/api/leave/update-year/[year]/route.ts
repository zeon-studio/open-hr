import { withDb } from "@/app/api/_lib/handler";
import { withApiAuth } from "@/server/auth/api-auth";
import { ENUM_ROLE } from "@/enums/roles";
import { addNewYearLeaveService } from "@/server/services/leave.service";
import { apiError, apiSuccess } from "@/server/utils/api-response";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ year: string }> },
) {
  return withDb(async () => {
    const { error } = await withApiAuth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER);
    if (error) return error;

    const { year } = await params;
    const parsedYear = parseInt(year);
    if (isNaN(parsedYear)) return apiError("Invalid year", 400);

    const result = await addNewYearLeaveService(parsedYear);
    return apiSuccess(result);
  });
}
