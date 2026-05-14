import { withDb } from "@/app/api/_lib/handler";
import { withApiAuth } from "@/server/auth/api-auth";
import { ENUM_ROLE } from "@/enums/roles";
import { getUpcomingEventsAndHolidaysService } from "@/server/services/calendar.service";
import { apiError, apiSuccess } from "@/server/utils/api-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ date: string }> },
) {
  return withDb(async () => {
    const { error } = await withApiAuth(
      ENUM_ROLE.ADMIN,
      ENUM_ROLE.MODERATOR,
      ENUM_ROLE.USER,
    );
    if (error) return error;

    const { date } = await params;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return apiError("Invalid date", 400);

    const result = await getUpcomingEventsAndHolidaysService(parsedDate);
    return apiSuccess(result);
  });
}
