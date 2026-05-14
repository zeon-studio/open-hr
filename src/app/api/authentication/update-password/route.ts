import { ENUM_ROLE } from "@/enums/roles";
import { withApiAuth } from "@/server/auth/api-auth";
import { apiError, apiSuccess } from "@/server/utils/api-response";
import { updatePasswordService } from "@/server/services/authentication.service";
import { NextRequest } from "next/server";
import { withDb } from "../../_lib/handler";

export async function PATCH(request: NextRequest) {
  return withDb(async () => {
    const authResult = await withApiAuth(
      ENUM_ROLE.ADMIN,
      ENUM_ROLE.MODERATOR,
      ENUM_ROLE.USER,
    );
    if (authResult.error) return authResult.error;

    const body = await request.json().catch(() => ({}));
    const sessionUser = authResult.session?.user;
    const targetId = body.id || sessionUser?.id;

    if (!targetId) {
      return apiError("Employee id is required", 400);
    }

    if (
      sessionUser?.role === ENUM_ROLE.USER &&
      sessionUser.id &&
      sessionUser.id !== targetId
    ) {
      return apiError("User is not authenticated", 403);
    }

    await updatePasswordService(targetId, body.current_password, body.new_password);
    return apiSuccess(true, "password updated successfully");
  });
}
