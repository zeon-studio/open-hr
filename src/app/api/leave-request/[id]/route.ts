import { withDb } from "@/app/api/_lib/handler";
import { withApiAuth } from "@/server/auth/api-auth";
import { ENUM_ROLE } from "@/enums/roles";
import {
  deleteLeaveRequestService,
  getLeaveRequestService,
  updateLeaveRequestService,
} from "@/server/services/leave-request.service";
import { apiSuccess } from "@/server/utils/api-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withDb(async () => {
    const { error } = await withApiAuth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER);
    if (error) return error;

    const { id } = await params;
    const result = await getLeaveRequestService(id);
    return apiSuccess(result);
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withDb(async () => {
    const { error } = await withApiAuth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR);
    if (error) return error;

    const { id } = await params;
    const body = await req.json();
    const result = await updateLeaveRequestService(id, body);
    return apiSuccess(result);
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return withDb(async () => {
    const { error } = await withApiAuth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER);
    if (error) return error;

    const { id } = await params;
    await deleteLeaveRequestService(id);
    return apiSuccess({ message: "Deleted successfully" });
  });
}
