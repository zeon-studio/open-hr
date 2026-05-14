import { apiSuccess } from "@/server/utils/api-response";
import { verifyOtpService } from "@/server/services/authentication.service";
import { NextRequest } from "next/server";
import { withDb } from "../../_lib/handler";

export async function POST(request: NextRequest) {
  return withDb(async () => {
    const body = await request.json().catch(() => ({}));
    await verifyOtpService(body.email, body.otp || body.token);
    return apiSuccess(true, "token verified successfully");
  });
}
