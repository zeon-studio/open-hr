import { Setting } from "@/server/models/module.model";
import { apiSuccess } from "@/server/utils/api-response";
import { NextRequest } from "next/server";
import { withDb } from "../_lib/handler";

export async function GET() {
  return withDb(async () => {
    const setting = await Setting.findOne({}).sort({ createdAt: -1 }).lean();
    return apiSuccess(setting || {}, "data get successfully");
  });
}

export async function PATCH(request: NextRequest) {
  return withDb(async () => {
    const body = await request.json().catch(() => ({}));
    const setting = await Setting.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true },
    );
    return apiSuccess(setting, "data updated successfully");
  });
}
