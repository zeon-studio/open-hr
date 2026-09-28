import { withEmployeeAccess } from "@/server/auth/api-auth";
import { apiSuccess } from "@/server/utils/api-response";
import { patchEmployeePasswordService } from "@/server/services/employee.service";
import { NextRequest } from "next/server";
import { withDb } from "../../../_lib/handler";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return withDb(async () => {
    const { id } = await context.params;
    // Initial password is set during onboarding only; signed-in users change
    // theirs via /authentication/update-password with their current password.
    const { error } = await withEmployeeAccess(request, id, {
      allowStaff: false,
      allowSelf: false,
    });
    if (error) return error;

    const body = await request.json().catch(() => ({}));
    const data = await patchEmployeePasswordService(id, body.password);
    return apiSuccess(data, "data updated successfully");
  });
}
