import { auth } from "@/auth";
import { Role } from "@/enums/roles";
import { apiError } from "@/server/utils/api-response";

export const withApiAuth = async (...allowedRoles: Role[]) => {
  const session = await auth();

  if (!session?.user) {
    return { error: apiError("User is not authenticated", 401) };
  }

  if (
    allowedRoles.length &&
    !allowedRoles.includes(session.user.role as Role)
  ) {
    return { error: apiError("User is not authenticated", 403) };
  }

  return { session };
};
