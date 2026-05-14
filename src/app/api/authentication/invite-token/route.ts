import { apiSuccess } from "@/server/utils/api-response";
import { issueInviteTokenService } from "@/server/services/authentication.service";
import { NextRequest } from "next/server";
import { withDb } from "../../_lib/handler";

export async function POST(request: NextRequest) {
  return withDb(async () => {
    const body = await request.json().catch(() => ({}));
    const token = await issueInviteTokenService(body.email);
    return apiSuccess({ invite_token: token }, "invite token generated");
  });
}
