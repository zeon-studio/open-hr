import { ENUM_ROLE } from "@/enums/roles";
import { withApiAuth } from "@/server/auth/api-auth";
import { apiSuccess } from "@/server/utils/api-response";
import { getAdminAndModsService } from "@/server/services/employee.service";
import { withDb } from "../../_lib/handler";

export async function GET() {
  return withDb(async () => {
    const authResult = await withApiAuth(ENUM_ROLE.ADMIN);
    if (authResult.error) return authResult.error;

    const data = await getAdminAndModsService();
    return apiSuccess(data, "employee get successfully");
  });
}
