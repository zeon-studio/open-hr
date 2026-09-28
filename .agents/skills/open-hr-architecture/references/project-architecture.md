# Project Architecture & Directory Layout

Open HR is a unified, full-stack HR management web application built on **Next.js 16 (App Router)**, **React 19**, **MongoDB with Mongoose**, **NextAuth v5 (beta)**, **Tailwind CSS v4**, and **shadcn/ui built on Base UI primitives** (`@base-ui/react`).

The application combines UI pages, REST API route handlers, and server-side business logic into a single cohesive repository.

---

## 1. Directory Blueprint

```text
open-hr/
├── AGENTS.md                  # Agent rules and development manifesto
├── components.json            # shadcn CLI config (Base UI + Tailwind v4)
├── next.config.js             # Image domains, package optimizations (lucide-react, date-fns)
├── package.json               # Scripts and dependencies (pnpm)
├── postcss.config.mjs         # PostCSS configuration
├── tsconfig.json              # TypeScript strict configuration and path aliases
├── example-data/              # Sample JSON datasets for seeding local MongoDB
├── public/                    # Static assets, fonts, icons
└── src/
    ├── app/                   # Next.js App Router (pages and API routes)
    │   ├── (auth)/            # Public authentication routes (/login, /forgot-password)
    │   ├── (protected)/       # Authenticated app routes (dashboard, employees, etc.)
    │   ├── api/               # REST API route handlers
    │   ├── onboard/           # Employee onboarding page
    │   ├── globals.css        # Minimal global stylesheet
    │   ├── layout.tsx         # Root layout (SessionProvider, Providers, Toaster)
    │   └── not-found.tsx      # 404 page
    ├── auth.ts                # NextAuth v5 configuration and auth handlers
    ├── proxy.ts               # Next.js 16 route protection and redirection proxy
    ├── config/                # Static app configuration
    │   ├── menu.ts            # Sidebar navigation items and RBAC permissions
    │   ├── modules.ts         # Module metadata, labels, and Lucide icons
    │   ├── options.json       # Dropdown options and category values
    │   └── variables.ts       # Centralized environment variable exports
    ├── constants/             # System-wide static constants
    ├── enums/                 # Domain enums (e.g. roles.ts: user, moderator, admin, former)
    ├── features/              # Client-side domain feature modules
    │   ├── asset/             # Asset queries, mutations, and components
    │   ├── calendar/          # Calendar and holiday feature logic
    │   ├── course/            # Course management feature logic
    │   ├── employee/          # Employee sub-features (bank, job, contact, onboarding)
    │   ├── leave/             # Leave entitlement hooks and views
    │   ├── leave-request/     # Leave request management and workflows
    │   ├── payroll/           # Payroll feature hooks and views
    │   ├── settings/          # Settings queries and forms
    │   └── tool/              # Tool allocation hooks and components
    ├── hooks/                 # Custom React hooks (e.g. use-settings.ts)
    ├── layouts/               # UI components, layout partials, and dev helpers
    │   ├── components/        # App-level shared UI components (@/components/*)
    │   │   └── ui/            # shadcn/ui primitives built on Base UI (@/components/ui/*)
    │   ├── helpers/           # Dev tools & utilities (@/helpers/*: ClearCache, TwSizeIndicator)
    │   └── partials/          # Persistent chrome (@/partials/*: Header, Sidebar, Providers)
    ├── lib/                   # Shared client utilities
    │   ├── api-client.ts      # Tag-based React query/mutation hook factory
    │   ├── axios.ts           # Configured Axios client with auth interceptors
    │   ├── client-api.ts      # Fetch-based API client helpers
    │   ├── app-context.tsx    # Global React context (app settings state)
    │   └── utils/             # Helper utilities (cn, date converters, errors)
    ├── server/                # Server-only logic (NEVER imported from client)
    │   ├── auth/              # Server auth verification (withApiAuth)
    │   ├── db/                # Mongoose database connection (connectMongoose)
    │   ├── mail/              # Nodemailer email sender and templates
    │   ├── models/            # Mongoose schemas (Employee, loose module models, tokens)
    │   ├── services/          # Pure server business logic (modules, employees, leaves)
    │   ├── storage/           # S3 / DigitalOcean Spaces client
    │   └── utils/             # API response formatting (apiSuccess, apiError)
    ├── styles/                # Tailwind CSS v4 stylesheets
    │   ├── base.css           # Base HTML element styling
    │   ├── components.css     # Common component utility classes
    │   ├── main.css           # Master CSS entry point (@import "tailwindcss"; @plugins)
    │   ├── theme.css          # Color palettes and font declarations
    │   └── variables.css      # Semantic CSS variables for dark/light themes
    └── types/                 # Shared TypeScript interfaces and type definitions
```

---

## 2. Path Aliases (`tsconfig.json`)

Always use the configured path aliases rather than relative `../../` imports:

| Alias | Target Directory | Description / Rules |
| :--- | :--- | :--- |
| `@/*` | `./src/*` | Generic fallback alias |
| `@/components/*` | `./src/layouts/components/*` | Shared app components and UI primitives |
| `@/components/ui/*` | `./src/layouts/components/ui/*` | Base UI primitives (buttons, inputs, dialogs) |
| `@/layouts/*` | `./src/layouts/*` | Layout components root |
| `@/partials/*` | `./src/layouts/partials/*` | Persistent chrome (Header, Sidebar, Providers) |
| `@/helpers/*` | `./src/layouts/helpers/*` | Dev & layout helpers (ClearCache, TwSizeIndicator) |
| `@/features/*` | `./src/features/*` | Feature modules (hooks, client UI) |
| `@/server/*` | `./src/server/*` | **Server-only** services, models, db, mail, storage |
| `@/lib/*` | `./src/lib/*` | Client utilities, Axios instance, `api-client` |
| `@/hooks/*` | `./src/hooks/*` | Shared custom React hooks |
| `@/types/*` | `./src/types/*` | Shared TypeScript domain types |
| `@/constants/*` | `./src/constants/*` | Static constants |
| `@/enums/*` | `./src/enums/*` | Domain enums (e.g. `roles.ts`) |
| `@/config/*` | `./src/config/*` | App configuration and static settings |
| `@/assets/*` | `./public/*` | Public static assets and logos |

---

## 3. Layer Dependency & Boundary Rules

```text
┌────────────────────────────────────────────────────────┐
│                      Client Layers                     │
│  src/app/(auth), src/app/(protected)                   │
│  src/features/*, src/layouts/*, src/hooks/*            │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON (apiRequest)
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Next.js API Routes                   │
│  src/app/api/[module]/route.ts                         │
│  src/app/api/employee/route.ts, etc.                   │
└──────────────────────────┬─────────────────────────────┘
                           │ Direct TS Calls (withDb)
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Server-Only Domain                   │
│  src/server/services/* ──► src/server/models/*         │
│  src/server/auth/*     ──► src/server/db/mongoose.ts   │
│  src/server/mail/*     ──► src/server/storage/s3.ts    │
└────────────────────────────────────────────────────────┘
```

### Strict Non-Negotiable Boundaries

1. **Never import `@/server/*` into client code:**
   - Any file with `"use client"`, feature components, or files in `src/features/` must **never** import from `src/server/`.
   - Client code mutates and queries data strictly via HTTP endpoints using the React query/mutation hooks in `src/features/<module>/api.ts`.
2. **`src/server/models/` defines schemas only:**
   - Models must never contain application business logic or external service calls.
   - Business logic belongs in `src/server/services/`.
3. **`src/lib/` and `src/types/` are strictly shared/client safe:**
   - They must never import from `src/features/` or `src/server/`.
4. **All database operations must use `withDb`:**
   - Route handlers in `src/app/api/` wrap operations in `withDb` from `@/app/api/_lib/handler` to guarantee a live Mongoose connection and standard 500 error catching.
5. **No direct database queries from React components:**
   - All persistence runs through API route handlers and service functions.
