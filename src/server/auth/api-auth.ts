import { auth } from "@/auth";
import { ENUM_ROLE, Role } from "@/enums/roles";
import { verifyInviteToken } from "@/server/services/authentication.service";
import { apiError } from "@/server/utils/api-response";

export const STAFF_ROLES: Role[] = [ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR];

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

// Returns the employee id carried by a valid `Authorization: Bearer <invite token>`.
export const getInviteTokenEmployeeId = (request: Request) => {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return null;

  try {
    const decoded = verifyInviteToken(token);
    return typeof decoded.id === "string" ? decoded.id : null;
  } catch {
    return null;
  }
};

type EmployeeAccessOptions = {
  // Signed-in admins/moderators may act on any employee.
  allowStaff?: boolean;
  // Signed-in (non-former) employees may act on their own record.
  allowSelf?: boolean;
  // Onboarding requests authenticated by an invite token for this employee.
  allowInvite?: boolean;
};

// Guards routes that act on a single employee record (`/employee/:id/...`).
export const withEmployeeAccess = async (
  request: Request,
  employeeId: string,
  { allowStaff = true, allowSelf = true, allowInvite = true }: EmployeeAccessOptions = {},
) => {
  if (allowInvite && getInviteTokenEmployeeId(request) === employeeId) {
    return { via: "invite" as const };
  }

  const session = await auth();
  if (!session?.user) {
    return { error: apiError("User is not authenticated", 401) };
  }

  const role = session.user.role as Role;
  if (allowStaff && STAFF_ROLES.includes(role)) {
    return { session, via: "staff" as const };
  }
  if (
    allowSelf &&
    role !== ENUM_ROLE.FORMER &&
    session.user.id === employeeId
  ) {
    return { session, via: "self" as const };
  }

  return { error: apiError("Forbidden: Insufficient permissions", 403) };
};
