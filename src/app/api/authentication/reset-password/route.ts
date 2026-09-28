import { apiSuccess } from "@/server/utils/api-response";
import { resetPasswordService } from "@/server/services/authentication.service";
import { NextRequest } from "next/server";
import { withDb } from "../../_lib/handler";

export async function POST(request: NextRequest) {
  return withDb(async () => {
    const body = await request.json().catch(() => ({}));
    await resetPasswordService(
      body.email,
      body.password,
      body.reset_token,
    );
    return apiSuccess(true, "password reset successfully");
  });
}
