---
name: open-hr-architecture
description: >-
  Architecture reference and guidelines for Open HR: Next.js 16 App Router, MongoDB/Mongoose, NextAuth v5, Base UI, Tailwind CSS v4, and role-based access.
---

# Open HR Architecture & Engineering Runbook

This skill is the central architectural blueprint and operating runbook for **Open HR** (`open-hr`), a full-stack human resources platform built with **Next.js 16 (App Router)**, **React 19**, **MongoDB with Mongoose**, **NextAuth v5**, and **shadcn/ui built on Base UI primitives** (`@base-ui/react`).

---

## 🧭 Architecture References

Before writing code or refactoring systems, consult the relevant deep reference:

- **Directory Layout & Boundaries:** [references/project-architecture.md](./references/project-architecture.md) — directory layout, path aliases, layer boundaries.
- **Database & API Routes:** [references/data-and-api.md](./references/data-and-api.md) — Mongoose connection caching, strict vs loose models, `withDb`, API handlers, client query/mutation hooks.
- **Auth & RBAC:** [references/authentication-and-roles.md](./references/authentication-and-roles.md) — NextAuth v5, JWT callbacks, `proxy.ts`, `withApiAuth`, roles (`user`, `moderator`, `admin`, `former`).
- **Components & UI:** [references/component-and-ui.md](./references/component-and-ui.md) — Base UI primitives in `@/components/ui`, layout partials, Tailwind CSS v4, and Bootstrap grid integration.
- **Domain Modules & Workflows:** [references/modules-and-workflows.md](./references/modules-and-workflows.md) — 15 domain modules, onboarding/offboarding workflows, leave approvals, asset tags.

---

## 1. Core Principles & Mental Model

1. **One Deployable App:** Next.js App Router contains the frontend React components, the REST API endpoints in `src/app/api/`, and the server-side Mongoose database layer.
2. **Server-Client Isolation:**
   - Server code (`src/server/`) must **never** be imported into client components or feature modules.
   - Client components interact with the database exclusively via HTTP endpoints through the tag-based query/mutation hooks in `src/features/<module>/api.ts`.
3. **Primitives Rule (Base UI, NOT Radix):**
   - UI primitives live exclusively in `src/layouts/components/ui/` (`@/components/ui/*`).
   - The project uses `@base-ui/react` primitives. Never install or import Radix UI.
4. **Wrap Route Handlers with `withDb`:**
   - Every API handler in `src/app/api/` must wrap database access in `withDb` from `@/app/api/_lib/handler`.
5. **Role-Based Access Enforcement:**
   - Edge level: `src/proxy.ts` (redirects unauthenticated visitors to `/login`).
   - API level: `withApiAuth` (checks session and allowed roles).
   - UI level: `menu.ts` access filter in `Sidebar` and role checks on dashboard.

---

## 2. Common Development Runbooks

### Runbook A: Adding or Extending a Domain Module

1. **Register Module:**
   Add module definition to `src/config/modules.ts` with its name, identifier, description, and Lucide icon.
2. **Define Mongoose Model:**
   In `src/server/models/module.model.ts`, create the loose model with appropriate index fields:

   ```typescript
   export const NewModule = createLooseModel("new_module", ["employee_id"]);
   ```

3. **Register in Model Map:**
   In `src/app/api/[module]/_lib/model-map.ts`, add the identifier to `VALID_MODULES`, link it to the model in `getModel()`, and configure searchable text fields in `listSearchFields`.
4. **Implement Client API Hooks:**
   In `src/features/new-module/api.ts`, declare queries and mutations using `createQueryHook` and `createMutationHook` from `@/lib/api-client`:

   ```typescript
   export const useGetNewModuleQuery = createQueryHook<TState, TPagination>(
     ({ page, limit, search }) => apiRequest({ url: `/new-module?page=${page}&limit=${limit}&search=${search}` }),
     ["new-module"]
   );
   export const useCreateNewModuleMutation = createMutationHook<TItem, Partial<TItem>>(
     (body) => apiRequest({ url: "/new-module", method: "POST", body }),
     ["new-module"]
   );
   ```

5. **Add Navigation Link:**
   In `src/config/menu.ts`, add the route, icon, and role `access: ["admin", "moderator"]`.

### Runbook B: Creating a Protected Page & Route

1. **Place in Route Group:**
   Create page under `src/app/(protected)/<feature>/page.tsx`.
2. **Client Components:**
   Add `"use client"` at the top if the page uses state, hooks, or event handlers.
3. **Responsive Grid Layout:**
   Use `tailwind-bootstrap-grid` classes for layout consistency:

   ```tsx
   export default function FeaturePage() {
     return (
       <div className="p-6">
         <div className="row gx-3">
           <div className="col-12 lg:col-8">
             <div className="bg-white rounded-lg p-5 border border-border">
               {/* Main Content */}
             </div>
           </div>
         </div>
       </div>
     );
   }
   ```

4. **Ensure Proxy Whitelist Compliance:**
   If the route is protected, do not add it to `publicUrl` in `src/proxy.ts`.

### Runbook C: Creating a Custom API Endpoint

1. Create `src/app/api/<custom-endpoint>/route.ts`.
2. Implement handlers with `withDb` and `withApiAuth`:

   ```typescript
   import { withDb } from "@/app/api/_lib/handler";
   import { withApiAuth } from "@/server/auth/api-auth";
   import { apiSuccess, apiError } from "@/server/utils/api-response";
   import { ENUM_ROLE } from "@/enums/roles";
   import { NextRequest } from "next/server";

   export async function POST(request: NextRequest) {
     return withDb(async () => {
       const { session, error } = await withApiAuth(ENUM_ROLE.ADMIN);
       if (error) return error;

       const body = await request.json().catch(() => ({}));
       // Execute business logic in service
       return apiSuccess(result, "Action completed successfully");
     });
   }
   ```

---

## 3. Quality Gates & Verification

Before finalizing any task, always execute and pass the following quality checks:

1. **TypeScript Strict Typecheck:**

   ```bash
   pnpm exec tsc --noEmit
   ```

2. **ESLint:**

   ```bash
   pnpm lint
   ```

3. **Production Build Validation:**

   ```bash
   pnpm build
   ```

---

## 4. Gotchas & Troubleshooting

- **Mongoose Connection Leaks:** Never call `mongoose.connect()` directly inside an API route. Always use `connectMongoose()` from `@/server/db/mongoose` or the `withDb` wrapper.
- **Client/Server Import Violations:** Importing a server model (e.g. `Employee` or `Leave`) into a client component will break bundling or cause runtime errors. Keep server logic strictly on the server.
- **Hydration Mismatches with Session / Settings:** Use an `isMounted` state guard or check `status === "loading"` from `useSession()` before rendering dynamic user/setting data.
- **Asset ID Duplication:** When creating assets, do not use `countDocuments()`. Always use `nextAssetId()` to find the highest historical serial.
