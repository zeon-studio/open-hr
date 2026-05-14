import { ENUM_ROLE } from "@/enums/roles";
import { withApiAuth } from "@/server/auth/api-auth";
import { apiSuccess } from "@/server/utils/api-response";
import {
  deleteEmployeeService,
  getEmployeeService,
} from "@/server/services/employee.service";
import { withDb } from "../../_lib/handler";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return withDb(async () => {
    const authResult = await withApiAuth(
      ENUM_ROLE.ADMIN,
      ENUM_ROLE.MODERATOR,
      ENUM_ROLE.USER,
      ENUM_ROLE.FORMER,
    );
    if (authResult.error) return authResult.error;

    const { id } = await context.params;
    const data = await getEmployeeService(id);
    return apiSuccess(data, "employee get successfully");
  });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return withDb(async () => {
    const authResult = await withApiAuth(ENUM_ROLE.ADMIN);
    if (authResult.error) return authResult.error;

    const { id } = await context.params;
    const data = await deleteEmployeeService(id);
    return apiSuccess(data, "data deleted successfully");
  });
}
