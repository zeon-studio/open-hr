# Authentication & Role-Based Access Control (RBAC)

Open HR implements authentication using **NextAuth v5 (Auth.js beta)** with a JWT session strategy, paired with Next.js 16 route proxying and server-side RBAC guards.

---

## 1. NextAuth v5 Setup (`src/auth.ts`)

NextAuth is configured in `src/auth.ts` and exports `{ handlers, signIn, signOut, auth }`.

### Providers

1. **Credentials Provider:**
   - Supports two authentication paths:
     - **Email + Password:** Validates hashed passwords using `bcrypt.compare`.
     - **Invite Token:** Validates onboarding / invitation JWT tokens signed with `JWT_SECRET`.
   - Populates session with employee fields from the database: `id`, `name`, `work_email`, `image`, and `role`.
2. **Google OAuth Provider:**
   - Allows Single Sign-On (SSO) using Google Workspace accounts matching an existing `work_email` record.

### JWT & Session Callbacks

The callbacks ensure custom employee attributes flow from token to session:

```typescript
callbacks: {
  async jwt({ token, user, trigger, session }) {
    if (trigger === "update") {
      token.name = session.name;
      token.email = session.email;
      token.image = session.image;
      return token;
    }

    if (user) {
      token.id = user.id!;
      token.name = user.name!;
      token.email = user.email!;
      token.image = user.image!;
      token.role = user.role!;
    }
    return token;
  },

  async session({ session, token }) {
    if (token) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.image = token.image as string;
      session.user.role = token.role as "user" | "moderator" | "admin" | "former";
    }
    return session;
  },
}
```

---

## 2. Roles & Permissions Matrix (`src/enums/roles.ts`)

```typescript
export const ENUM_ROLE = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
  FORMER: "former",
} as const;

export type Role = (typeof ENUM_ROLE)[keyof typeof ENUM_ROLE];
```

### Role Capabilities

| Role | Access Scope | Accessible Areas |
| :--- | :--- | :--- |
| **`admin`** | Full Organization Superuser | Everything: Payroll, Settings, Employees, Leaves, Calendar, Assets, Tools, Courses, Onboarding & Offboarding. |
| **`moderator`** | HR Manager / Department Lead | Employees directory, Leave Approvals, Company Calendar, Tools allocation, Asset tracking, Course assignments. Cannot access Settings or Payroll. |
| **`user`** | Standard Employee | Personal Dashboard (assigned tools, courses, assets), My Profile, My Leaves, My Leave Requests, Calendar. |
| **`former`** | Archived / Offboarded Employee | Read-only view indicating their account has been archived. |

---

## 3. Next.js 16 Proxy Route Protection (`src/proxy.ts`)

Next.js 16 replaces traditional middleware conventions with `src/proxy.ts`. It controls entry into the application:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const publicUrl = [
  "/login",
  "/register",
  "/verify",
  "/forgot-password",
  "/onboard",
];

export async function proxy(request: NextRequest) {
  const { user } = (await auth()) || {};
  const isAuth = !!user?.id;
  const pathname = request.nextUrl.pathname;

  // 1. Authenticated users hitting login or register are bounced to home
  if (publicUrl.some((u) => pathname.startsWith(u))) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 2. Unauthenticated visitors are redirected to /login with preserve 'from' URL
  if (!isAuth) {
    let from = request.nextUrl.pathname;
    if (request.nextUrl.search) from += request.nextUrl.search;
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
    );
  }

  return NextResponse.next();
}
```

---

## 4. Server API Route Guards (`src/server/auth/api-auth.ts`)

To guard backend API routes, use `withApiAuth`:

```typescript
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
    return { error: apiError("Forbidden: Insufficient permissions", 403) };
  }

  return { session };
};
```

### Usage in API Routes

```typescript
export async function POST(request: NextRequest) {
  return withDb(async () => {
    const { session, error } = await withApiAuth(ENUM_ROLE.ADMIN);
    if (error) return error;

    // Proceed with admin-only operation
  });
}
```

---

## 5. UI Role Filtering (`src/config/menu.ts`)

Navigation items in `src/config/menu.ts` declare their allowed roles:

```typescript
{
  name: "Payroll",
  path: "/payroll",
  icon: HandCoins,
  module: "payroll",
  access: ["admin"],
},
{
  name: "Employees",
  path: "/employees",
  icon: UsersIcon,
  module: "employee",
  access: ["admin", "moderator"],
},
{
  name: "My Leaves",
  path: "/my-leaves",
  icon: CalendarX,
  module: "leave",
  access: ["user", "former"],
}
```

The `Sidebar` component filters links against `session.user.role` to ensure unauthorized menu items never render.
