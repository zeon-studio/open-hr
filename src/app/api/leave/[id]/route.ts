import { withDb } from "@/app/api/_lib/handler";
import { withApiAuth } from "@/server/auth/api-auth";
import { ENUM_ROLE } from "@/enums/roles";
import { deleteLeaveService, getLeaveService } from "@/server/services/leave.service";
import { apiSuccess } from "@/server/utils/api-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withDb(async () => {
    const { error } = await withApiAuth(
      ENUM_ROLE.ADMIN,
      ENUM_ROLE.MODERATOR,
      ENUM_ROLE.USER,
      ENUM_ROLE.FORMER,
    );
    if (error) return error;

    const { id } = await params;
    const result = await getLeaveService(id);
    return apiSuccess(result);
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withDb(async () => {
    const { error } = await withApiAuth(ENUM_ROLE.ADMIN);
    if (error) return error;

    const { id } = await params;
    const result = await deleteLeaveService(id);
    return apiSuccess(result);
  });
}
