import { ENUM_ROLE } from "@/enums/roles";
import { withApiAuth } from "@/server/auth/api-auth";
import { apiSuccess } from "@/server/utils/api-response";
import { patchEmployeeService } from "@/server/services/employee.service";
import { NextRequest } from "next/server";
import { withDb } from "../../../_lib/handler";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return withDb(async () => {
    const authResult = await withApiAuth(ENUM_ROLE.ADMIN);
    if (authResult.error) return authResult.error;

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const data = await patchEmployeeService(id, { role: body.role });
    return apiSuccess(data, "data updated successfully");
  });
}
