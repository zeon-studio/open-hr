"use server";

import { auth } from "@/auth";
import { ENUM_ROLE } from "@/enums/roles";
import { connectMongoose } from "@/lib/mongoose";
import { Setting } from "@/models/module.model";
import { revalidatePath } from "next/cache";

type UpdateSettingModuleInput = {
  name: string;
  enable: boolean;
};

type UpdateSettingModuleResult = { ok: true } | { ok: false; error: string };

export const updateSettingModuleAction = async ({
  name,
  enable,
}: UpdateSettingModuleInput): Promise<UpdateSettingModuleResult> => {
  const session = await auth();

  if (!session?.user) {
    return { ok: false, error: "User is not authenticated" };
  }

  if (session.user.role !== ENUM_ROLE.ADMIN) {
    return { ok: false, error: "User is not authorized" };
  }

  try {
    await connectMongoose();

    const settingDoc = await Setting.findOne({}).sort({ createdAt: -1 }).lean();
    const existingModules = (settingDoc as Record<string, unknown> | null)?.[
      "modules"
    ];
    const currentModules = Array.isArray(existingModules)
      ? [...existingModules]
      : [];

    const moduleIndex = currentModules.findIndex(
      (item: unknown) =>
        typeof item === "object" &&
        item !== null &&
        "name" in item &&
        (item as { name?: unknown }).name === name,
    );

    if (moduleIndex >= 0) {
      currentModules[moduleIndex] = {
        ...(currentModules[moduleIndex] as object),
        name,
        enable,
      };
    } else {
      currentModules.push({ name, enable });
    }

    await Setting.findOneAndUpdate(
      {},
      { $set: { modules: currentModules } },
      { new: true, upsert: true },
    );

    revalidatePath("/settings");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update module setting" };
  }
};
