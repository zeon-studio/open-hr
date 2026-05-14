import { ENUM_ROLE } from "@/enums/roles";
import { withApiAuth } from "@/server/auth/api-auth";
import { apiSuccess } from "@/server/utils/api-response";
import { patchEmployeeService } from "@/server/services/employee.service";
import { NextRequest } from "next/server";
import { withDb } from "../../_lib/handler";

export async function PATCH(request: NextRequest) {
  return withDb(async () => {
    const authResult = await withApiAuth(ENUM_ROLE.ADMIN);
    if (authResult.error) return authResult.error;

    const body = await request.json().catch(() => ({}));
    const updates = (body.updates || []) as Array<{ id: string; role: string }>;
    await Promise.all(
      updates
        .filter((item) => Boolean(item.id))
        .map(({ id, role }) => patchEmployeeService(id, { role })),
    );
    return apiSuccess(true, "roles updated successfully");
  });
}
