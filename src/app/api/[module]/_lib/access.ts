import { ENUM_ROLE, Role } from "@/enums/roles";
import { STAFF_ROLES, withApiAuth } from "@/server/auth/api-auth";
import { apiError } from "@/server/utils/api-response";

type ModuleAccess = {
  // Roles with full access to every record in the module.
  manage: Role[];
  // Employees may read records that belong to them.
  selfRead: boolean;
  // Employees (not former) may create/update records that belong to them.
  selfWrite: boolean;
};

const ADMIN_ONLY: Role[] = [ENUM_ROLE.ADMIN];

const moduleAccess: Record<string, ModuleAccess> = {
  payroll: { manage: ADMIN_ONLY, selfRead: true, selfWrite: false },
  asset: { manage: STAFF_ROLES, selfRead: true, selfWrite: false },
  tool: { manage: STAFF_ROLES, selfRead: true, selfWrite: false },
  course: { manage: STAFF_ROLES, selfRead: true, selfWrite: false },
  "employee-job": { manage: STAFF_ROLES, selfRead: true, selfWrite: false },
  "employee-achievement": { manage: STAFF_ROLES, selfRead: true, selfWrite: false },
  "employee-onboarding": { manage: STAFF_ROLES, selfRead: true, selfWrite: false },
  "employee-offboarding": { manage: STAFF_ROLES, selfRead: true, selfWrite: false },
  "employee-bank": { manage: STAFF_ROLES, selfRead: true, selfWrite: true },
  "employee-contact": { manage: STAFF_ROLES, selfRead: true, selfWrite: true },
  "employee-education": { manage: STAFF_ROLES, selfRead: true, selfWrite: true },
  "employee-document": { manage: STAFF_ROLES, selfRead: true, selfWrite: true },
};

/**
 * Authorizes a request against a generic module.
 * `ownerId` is the employee id the request targets; omit it for operations
 * that are never self-service (lists, deletes, admin tooling).
 */
export const authorizeModule = async (
  moduleName: string,
  { write, ownerId }: { write: boolean; ownerId?: string },
) => {
  const { session, error } = await withApiAuth();
  if (error) return { error };

  const access = moduleAccess[moduleName];
  const role = session.user.role as Role;
  if (!access) return { error: apiError("Route not found", 404) };
  if (access.manage.includes(role)) return { session };

  const isOwner = !!ownerId && ownerId === session.user.id;
  if (isOwner && !write && access.selfRead) return { session };
  if (isOwner && write && access.selfWrite && role !== ENUM_ROLE.FORMER) {
    return { session };
  }

  return { error: apiError("Forbidden: Insufficient permissions", 403) };
};
