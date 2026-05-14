import { ENUM_ROLE } from "@/enums/roles";
import { withApiAuth } from "@/server/auth/api-auth";
import { apiSuccess } from "@/server/utils/api-response";
import { getEmployeeBasicsService } from "@/server/services/employee.service";
import { withDb } from "../../_lib/handler";

export async function GET() {
  return withDb(async () => {
    const authResult = await withApiAuth(
      ENUM_ROLE.ADMIN,
      ENUM_ROLE.MODERATOR,
      ENUM_ROLE.USER,
    );
    if (authResult.error) return authResult.error;

    const data = await getEmployeeBasicsService();
    return apiSuccess(data, "data get successfully");
  });
}
