<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
<!-- END:nextjs-agent-rules -->

# Open HR Solution (`open-hr`)

`open-hr` is a modern, full-stack HR management web application for small and medium enterprises built on **Next.js 16 (App Router)**, **React 19**, **MongoDB via Mongoose**, **NextAuth v5 (Auth.js beta)**, **Tailwind CSS v4**, and **shadcn/ui built on Base UI primitives** (`@base-ui/react`, not Radix). Both the user interface, REST API route handlers, and server-side domain services run in a single deployable Next.js app.

> [!IMPORTANT]
> **This is a production-grade full-stack HR application.** Read this file first in every session.
> The full architecture reference is the progressive-disclosure skill 📖 [`.agents/skills/open-hr-architecture/SKILL.md`](.agents/skills/open-hr-architecture/SKILL.md) — read its relevant reference before adding a page, a component, an API handler, or touching models and server services. Domain workflows and schema design are in [`references/modules-and-workflows.md`](.agents/skills/open-hr-architecture/references/modules-and-workflows.md).

---

## 🧭 Architecture Skill & Reference Map

`.agents/skills/open-hr-architecture/references/`:

- **Project Architecture:** [`project-architecture.md`](.agents/skills/open-hr-architecture/references/project-architecture.md) — directory layout, path aliases, layer boundaries, server vs client isolation.
- **Data Layer & API:** [`data-and-api.md`](.agents/skills/open-hr-architecture/references/data-and-api.md) — Mongoose connection caching, strict vs loose models, `withDb`, API handlers, client query/mutation hooks.
- **Authentication & RBAC:** [`authentication-and-roles.md`](.agents/skills/open-hr-architecture/references/authentication-and-roles.md) — NextAuth v5, JWT callbacks, `proxy.ts`, `withApiAuth`, roles (`user`, `moderator`, `admin`, `former`).
- **Component Architecture:** [`component-and-ui.md`](.agents/skills/open-hr-architecture/references/component-and-ui.md) — Base UI primitives in `@/components/ui/*`, layout partials, Tailwind CSS v4, and Bootstrap grid integration.
- **Modules & Workflows:** [`modules-and-workflows.md`](.agents/skills/open-hr-architecture/references/modules-and-workflows.md) — 15 domain modules, onboarding/offboarding workflows, leave approvals, asset tags.

*Other skills in `.agents/skills/`:* `shadcn`, `taste-skill`, `skill-creator`.

---

## 👤 Who You're Working With

The product owner makes product and feature decisions; you make technical decisions and do all the implementation work.

- Explain in plain language. Never ask them to write or edit code; if they must configure an environment variable or external service, provide click-by-click instructions.
- Run, test, and verify everything yourself before reporting it done.
- Ask only for decisions (business rules, UI copy, field requirements), batched.

---

## 🛠️ Core Tech Stack & Rules

- **Framework & Runtime:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4 (CSS-first, no `tailwind.config.*`). Package manager: **pnpm**.
- **Database:** MongoDB via Mongoose. Connections are cached across hot reloads in `src/server/db/mongoose.ts` (`connectMongoose()`). API route handlers must wrap execution in `withDb` from `@/app/api/_lib/handler`.
- **Mongoose Models:** Strict models (`Employee` in `src/server/models/employee.model.ts`) with hidden password selection; loose models (`createLooseModel` in `src/server/models/module.model.ts`) for dynamic module collections with indexed fields.
- **Authentication:** NextAuth v5 in `src/auth.ts`:
  - Credentials Provider: Supports bcrypt-hashed password checks and invite token verification via JWT.
  - Google Provider: Single sign-on matching existing employee `work_email`.
  - JWT strategy with `id`, `name`, `email`, `image`, and `role` mapped into token and session.
- **Route Protection & Redirection:** Next.js 16 proxy in `src/proxy.ts` guards protected routes and redirects unauthenticated users to `/login?from=...`, while bouncing authenticated users away from public auth pages.
- **Storage:** S3-compatible cloud storage (DigitalOcean Spaces / AWS S3) initialized in `src/server/storage/s3.ts`.
- **Email:** Nodemailer in `src/server/mail/mail-sender.ts` for invitation tokens and transactional notifications.
- **Environment:** Centralized configuration in `src/config/variables.ts` sourced from `.env`.

---

## 📏 Engineering Rules (non-negotiable)

- **Strict Server/Client Boundary:** Anything inside `src/server/` is strictly server-only. Never import from `src/server/` inside client components (`"use client"`) or `src/features/`.
- **All Database Queries Run via Services:** Business logic belongs in `src/server/services/`, not inside API route handlers or React components.
- **Safe API Handlers:** Wrap every route handler in `withDb(async () => { ... })` and return standard responses using `apiSuccess()` or `apiError()` from `@/server/utils/api-response`.
- **Client Queries through Feature Hooks:** Client components fetch and mutate data using hooks defined in `src/features/<module>/api.ts`, built on `createQueryHook` / `createMutationHook` from `@/lib/api-client` with tag invalidation (`invalidateTags`).
- **Path Aliases:** Follow `tsconfig.json` path aliases (`@/components/*`, `@/components/ui/*`, `@/partials/*`, `@/helpers/*`, `@/server/*`, `@/features/*`, `@/lib/*`, `@/types/*`, `@/config/*`, `@/enums/*`). Avoid relative `../../` imports.
- **Never Expose Sensitive Fields:** Passwords and internal reset tokens must be hidden (`select: false`) and never returned in API payloads.
- **Reusable Components Only:** If a UI pattern appears twice, make it a reusable component in `@/components/*`.

---

## 🎨 Mandatory UI/UX Standards: Base UI & Tailwind CSS v4

- **Strict Primitives Rule (Base UI, NOT Radix):** UI primitives live only in `src/layouts/components/ui/` (imported as `@/components/ui/*`), powered by `@base-ui/react`. **Do NOT install or import Radix UI primitives.**
- **Component Placement:**
  - `src/layouts/components/ui/` — Base UI / shadcn primitives (buttons, inputs, dialogs, dropdowns, tables).
  - `src/layouts/components/` — Shared application components (`Avatar`, `ConfirmationPopup`, `FileManager`, `SearchBox`, `UserInfo`, `Gravatar`, `Pagination`).
  - `src/layouts/partials/` — Persistent layout chrome (`Header`, `Sidebar`, `Providers`, `EditForm`).
  - `src/layouts/helpers/` — Layout and dev helpers (`ClearCache`, `TwSizeIndicator`).
  - `src/features/<module>/` — Feature-specific views, forms, and client hooks.
- **Tailwind CSS v4 & Grid Integration:**
  - CSS entry point: `src/styles/main.css` (`@import "tailwindcss";`, plugins: `@tailwindcss/forms`, `tailwindcss-animate`, `tailwind-bootstrap-grid`).
  - Tokens and colors in `src/styles/theme.css` and `src/styles/variables.css`.
  - Use `tailwind-bootstrap-grid` classes (`container`, `row`, `col-12`, `lg:col-6`, `gx-3`, etc.) for responsive page layouts and forms.

---

## 📁 Route Topology & Access Control

- **`src/app/(auth)/`** → Public auth routes: `/login`, `/forgot-password`, `/verify`, `/onboard`.
- **`src/app/(protected)/`** → Authenticated application routes:
  - `/` — Role-aware Dashboard (shows tools/courses/assets for `user`; upcoming leaves/tasks/holidays for `admin`/`moderator`).
  - `/employees`, `/employees-archived` — Employee directory and profile management (`admin`, `moderator`).
  - `/my-profile` — Employee self-service profile (`user`, `former`).
  - `/leaves`, `/leave-requests` — Leave management and approval workflow (`admin`, `moderator`).
  - `/my-leaves`, `/my-leave-requests` — Personal leave entitlements and requests (`user`, `former`).
  - `/calendar` — Company events and holidays (`admin`, `moderator`, `user`).
  - `/payroll` — Payroll processing (`admin` only).
  - `/assets`, `/tools`, `/courses` — Asset tracking, tool licenses, and course allocation (`admin`, `moderator`).
  - `/settings` — Organization settings and module toggles (`admin` only).
- **`src/app/api/`** → REST API route handlers:
  - `[module]/route.ts` & `[module]/[id]/route.ts` — Generic CRUD for 15 domain modules.
  - `employee/` & `employees/` — Employee management endpoints.
  - `leave/` & `leave-request/` — Leave application and balance adjustments.
  - `calendar/` — Calendar event endpoints.
  - `setting/` — Application and module configuration.
  - `bucket/` — S3 file upload and presigned URL operations.
  - `auth/` & `authentication/` — NextAuth handlers and password reset OTP.

---

## 🔄 Development Protocol

1. **Initial Setup:** `pnpm install` ➔ `cp .env.example .env` (fill in `MONGO_URI`, `NEXTAUTH_SECRET`, `JWT_SECRET`) ➔ `pnpm dev`.
2. **Local Testing Data:** Seed collections using sample datasets from `example-data/` (`employee.json`, `settings.json`).
3. **Module Changes:** When adding or updating a module, update `src/config/modules.ts`, `src/server/models/module.model.ts`, `src/app/api/[module]/_lib/model-map.ts`, and `src/config/menu.ts`.

---
## 🚦 Quality Gates

Run and verify before reporting any change complete:

- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
