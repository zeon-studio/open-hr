"use server";

import { auth } from "@/auth";
import { ENUM_ROLE } from "@/enums/roles";
import { connectMongoose } from "@/lib/mongoose";
import { Setting } from "@/models/module.model";
import { revalidatePath } from "next/cache";

type UpdateSettingConfigureInput = {
  app_name: string;
  app_url: string;
  favicon_url: string;
  logo_url: string;
  logo_width: number;
  logo_height: number;
  company_name: string;
  company_website: string;
  communication_platform: string;
  communication_platform_url: string;
};

type UpdateSettingConfigureResult = { ok: true } | { ok: false; error: string };

export const updateSettingConfigureAction = async (
  payload: UpdateSettingConfigureInput,
): Promise<UpdateSettingConfigureResult> => {
  const session = await auth();

  if (!session?.user) {
    return { ok: false, error: "User is not authenticated" };
  }

  if (session.user.role !== ENUM_ROLE.ADMIN) {
    return { ok: false, error: "User is not authorized" };
  }

  try {
    await connectMongoose();

    await Setting.findOneAndUpdate(
      {},
      {
        $set: {
          app_name: payload.app_name,
          app_url: payload.app_url,
          favicon_url: payload.favicon_url,
          logo_url: payload.logo_url,
          logo_width: payload.logo_width,
          logo_height: payload.logo_height,
          company_name: payload.company_name,
          company_website: payload.company_website,
          communication_platform: payload.communication_platform,
          communication_platform_url: payload.communication_platform_url,
        },
      },
      { new: true, upsert: true },
    );

    revalidatePath("/settings");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update settings" };
  }
};
