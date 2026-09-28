import { apiSuccess } from "@/server/utils/api-response";
import { verifyUserService } from "@/server/services/authentication.service";
import { NextRequest } from "next/server";
import { withDb } from "../../_lib/handler";

export async function POST(request: NextRequest) {
  return withDb(async () => {
    const body = await request.json().catch(() => ({}));
    await verifyUserService(body.email);
    return apiSuccess(true, "verification token sent successfully");
  });
}
