import { withDb } from "@/app/api/_lib/handler";
import { withApiAuth } from "@/server/auth/api-auth";
import { ENUM_ROLE } from "@/enums/roles";
import {
  deleteCalendarService,
  getCalendarService,
  updateCalendarService,
} from "@/server/services/calendar.service";
import { apiError, apiSuccess } from "@/server/utils/api-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ year: string }> },
) {
  return withDb(async () => {
    const { error } = await withApiAuth(
      ENUM_ROLE.ADMIN,
      ENUM_ROLE.MODERATOR,
      ENUM_ROLE.USER,
    );
    if (error) return error;

    const { year } = await params;
    const parsed = parseInt(year);
    if (isNaN(parsed)) return apiError("Invalid year", 400);

    const result = await getCalendarService(parsed);
    return apiSuccess(result);
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ year: string }> },
) {
  return withDb(async () => {
    const { error } = await withApiAuth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR);
    if (error) return error;

    const { year } = await params;
    const body = await req.json();
    const result = await updateCalendarService(year, body);
    return apiSuccess(result);
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ year: string }> },
) {
  return withDb(async () => {
    const { error } = await withApiAuth(ENUM_ROLE.ADMIN);
    if (error) return error;

    const { year } = await params;
    const result = await deleteCalendarService(year);
    return apiSuccess(result);
  });
}
