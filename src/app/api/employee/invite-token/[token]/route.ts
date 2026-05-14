import { apiSuccess } from "@/server/utils/api-response";
import { getEmployeeByInviteTokenService } from "@/server/services/employee.service";
import { withDb } from "../../../_lib/handler";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  return withDb(async () => {
    const { token } = await context.params;
    const data = await getEmployeeByInviteTokenService(token);
    return apiSuccess(data, "employee get successfully");
  });
}
