import { withDb } from "@/app/api/_lib/handler";
import { withApiAuth } from "@/server/auth/api-auth";
import { ENUM_ROLE } from "@/enums/roles";
import {
  createCalendarService,
  getAllCalendarService,
} from "@/server/services/calendar.service";
import { apiSuccess } from "@/server/utils/api-response";

export async function GET() {
  return withDb(async () => {
    const { error } = await withApiAuth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR);
    if (error) return error;

    const result = await getAllCalendarService();
    return apiSuccess(result);
  });
}

export async function POST(req: Request) {
  return withDb(async () => {
    const { error } = await withApiAuth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR);
    if (error) return error;

    const body = await req.json();
    const result = await createCalendarService(body);
    return apiSuccess(result);
  });
}
