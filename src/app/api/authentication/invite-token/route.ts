import { apiSuccess } from "@/server/utils/api-response";
import { issueInviteTokenService } from "@/server/services/authentication.service";
import { STAFF_ROLES, withApiAuth } from "@/server/auth/api-auth";
import { NextRequest } from "next/server";
import { withDb } from "../../_lib/handler";

export async function POST(request: NextRequest) {
  return withDb(async () => {
    const { error } = await withApiAuth(...STAFF_ROLES);
    if (error) return error;

    const body = await request.json().catch(() => ({}));
    const token = await issueInviteTokenService(body.email);
    return apiSuccess({ invite_token: token }, "invite token generated");
  });
}
