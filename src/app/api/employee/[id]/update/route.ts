import { withEmployeeAccess } from "@/server/auth/api-auth";
import { apiSuccess } from "@/server/utils/api-response";
import { patchEmployeeService } from "@/server/services/employee.service";
import { NextRequest } from "next/server";
import { withDb } from "../../../_lib/handler";

// Changed only through their dedicated, admin-guarded routes.
const PROTECTED_FIELDS = ["_id", "id", "password", "role"];
// Staff-managed fields an employee may not set on their own record.
const STAFF_ONLY_FIELDS = ["note", "status"];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return withDb(async () => {
    const { id } = await context.params;
    const access = await withEmployeeAccess(request, id);
    if (access.error) return access.error;

    const body = await request.json().catch(() => ({}));
    for (const field of PROTECTED_FIELDS) delete body[field];
    if (access.via !== "staff") {
      // Completing onboarding may activate the account, nothing else.
      const activating = access.via === "invite" && body.status === "active";
      for (const field of STAFF_ONLY_FIELDS) {
        if (!(field === "status" && activating)) delete body[field];
      }
    }

    const data = await patchEmployeeService(id, body);
    return apiSuccess(data, "data updated successfully");
  });
}
