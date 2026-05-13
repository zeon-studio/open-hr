"use server";

import { auth } from "@/auth";
import { ENUM_ROLE } from "@/enums/roles";
import { connectMongoose } from "@/lib/mongoose";
import { Setting } from "@/models/module.model";
import { revalidatePath } from "next/cache";

type UpdateSettingSectionsInput = Partial<{
  weekends: string[];
  conditional_weekends: { name: string; pattern: number[] }[];
  payroll: {
    basic: string;
    house_rent: string;
    conveyance: string;
    medical: string;
  };
  max_leave_per_day: number;
  leave_threshold_days: number;
  leaves: {
    name: "earned" | "sick" | "casual" | "without_pay";
    days: number;
  }[];
  onboarding_tasks: { name: string; assigned_to: string }[];
  offboarding_tasks: { name: string; assigned_to: string }[];
}>;

type UpdateSettingSectionsResult = { ok: true } | { ok: false; error: string };

export const updateSettingSectionsAction = async (
  payload: UpdateSettingSectionsInput,
): Promise<UpdateSettingSectionsResult> => {
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
      { $set: payload },
      { new: true, upsert: true },
    );

    revalidatePath("/settings");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update settings" };
  }
};
