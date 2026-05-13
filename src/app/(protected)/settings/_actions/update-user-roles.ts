"use server";

import { auth } from "@/auth";
import { ENUM_ROLE } from "@/enums/roles";
import { connectMongoose } from "@/lib/mongoose";
import { Employee } from "@/models/employee.model";
import { revalidatePath } from "next/cache";

type RoleValue = "user" | "moderator" | "admin";

type UpdateUserRolesInput = {
  updates: Array<{ id: string; role: RoleValue }>;
};

type UpdateUserRolesResult = { ok: true } | { ok: false; error: string };

export const updateUserRolesAction = async ({
  updates,
}: UpdateUserRolesInput): Promise<UpdateUserRolesResult> => {
  const session = await auth();

  if (!session?.user) {
    return { ok: false, error: "User is not authenticated" };
  }

  if (session.user.role !== ENUM_ROLE.ADMIN) {
    return { ok: false, error: "User is not authorized" };
  }

  try {
    await connectMongoose();

    await Promise.all(
      updates
        .filter((item) => Boolean(item.id))
        .map(({ id, role }) =>
          Employee.findOneAndUpdate({ id }, { $set: { role } }, { new: true }),
        ),
    );

    revalidatePath("/settings");
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to update user roles" };
  }
};
