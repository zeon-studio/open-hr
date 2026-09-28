# Data Layer & API Architecture

Open HR uses **MongoDB with Mongoose** for persistent storage and **Next.js App Router API Route Handlers** for its REST API. Data fetching on the client uses a custom tag-based React hook system built on Axios.

---

## 1. Database Connection & Caching (`src/server/db/mongoose.ts`)

Mongoose connections in Next.js must be cached across hot module reloads in development to prevent connection exhaustion:

```typescript
import variables from "@/config/variables";
import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = global as typeof globalThis & {
  _mongoose?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose._mongoose || {
  conn: null,
  promise: null,
};

globalWithMongoose._mongoose = cached;

export const connectMongoose = async () => {
  if (cached.conn) return cached.conn;

  if (!variables.database_uri) {
    throw new Error("MONGO_URI is not configured");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(variables.database_uri, {
      dbName: process.env.MONGO_DB_NAME,
      bufferCommands: false,
      maxPoolSize: 20,
      minPoolSize: 5,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
```

---

## 2. Mongoose Models (`src/server/models/`)

### Strict Models (`employee.model.ts`)

The `Employee` model defines strict fields, required indexes, and hidden password selection:

```typescript
const EmployeeSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: "" },
    image: { type: String, default: "" },
    photo_source: { type: String, default: null },
    work_email: { type: String, default: "", index: true },
    password: { type: String, select: false },
    personal_email: { type: String, default: "" },
    communication_id: { type: String, default: "" },
    department: { type: String, default: "" },
    designation: { type: String, default: "" },
    role: { type: String, default: "user", index: true },
    status: { type: String, default: "pending", index: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true, strict: false }
);
```

### Loose Models (`module.model.ts`)

Domain modules use `createLooseModel`, allowing dynamic schemas while enforcing indexes and cache-busting stale cached models:

```typescript
const createLooseModel = (name: string, indexedFields: string[] = []): Model<any> => {
  const schema = new Schema({}, { timestamps: true, strict: false });
  indexedFields.forEach((field) => schema.index({ [field]: 1 }));

  delete (mongoose.models as Record<string, unknown>)[name];
  return mongoose.model<any, Model<any>>(name, schema);
};

export const Leave = createLooseModel("leave", ["employee_id", "years.year"]);
export const LeaveRequest = createLooseModel("leave_request", [
  "employee_id",
  "status",
  "start_date",
  "end_date",
]);
export const Payroll = createLooseModel("payroll", ["employee_id"]);
export const Asset = createLooseModel("asset", ["asset_id", "employee_id"]);
export const Calendar = createLooseModel("calendar", ["year"]);
export const Course = createLooseModel("course", ["employee_id"]);
export const Tool = createLooseModel("tool", ["employee_id"]);
```

---

## 3. Server Service Layer (`src/server/services/`)

All database mutations and queries must run through services in `src/server/services/`.

### Generic Module Service (`module.service.ts`)

Provides standardized CRUD operations with pagination, `$or` regex searching across configured fields, and upsert logic:

- `listDocuments(model, { page, limit, search, searchFields, extraFilter })`
- `getByIdOrField(model, value, fields)`
- `createDocument(model, payload)`
- `upsertByField(model, key, value, payload)`
- `deleteByFields(model, filter)`

### Domain Services

- `employee.service.ts`: Employee lifecycle management, creation, updates, and role-based filtering.
- `leave-request.service.ts`: Handles leave requests, conflict detection, holiday awareness, and status updates (approved, rejected, pending).
- `leave.service.ts`: Yearly leave allocations and balance tracking.
- `calendar.service.ts`: Company calendar events, weekends, and holidays.
- `authentication.service.ts`: Token verification, OTP generation, and password resets.

---

## 4. API Route Handlers (`src/app/api/`)

Route handlers execute server-side and interact with the database via services.

### Safe DB Execution with `withDb`

Always wrap route handler logic with `withDb` from `@/app/api/_lib/handler`:

```typescript
import { withDb } from "@/app/api/_lib/handler";
import { apiSuccess, apiError } from "@/server/utils/api-response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return withDb(async () => {
    // 1. Authenticate if required
    // 2. Query service
    // 3. Return formatted response
    return apiSuccess(data, "Data fetched successfully");
  });
}
```

### Standard Response Format (`src/server/utils/api-response.ts`)

- **Success:** `apiSuccess(data, message = "Success", meta = undefined, status = 200)`
  Returns: `{ success: true, message, result: data, meta }`
- **Error:** `apiError(message = "Something went wrong", status = 400, errors = undefined)`
  Returns: `{ success: false, message, errors }`

### Generic Module Handler (`src/app/api/[module]/route.ts`)

Supports any valid module in `VALID_MODULES`:

- `GET /api/[module]?page=1&limit=10&search=foo&employee_id=EMP001`
- `POST /api/[module]` — creates a new document (handles special module logic like auto asset ID generation and offboarding task seeding)
- `GET /api/[module]/[id]` — finds by ID or slug
- `PUT /api/[module]/[id]` — updates document
- `DELETE /api/[module]/[id]` — removes document

---

## 5. Client Data Fetching (`src/lib/api-client.ts`)

Instead of raw Axios or fetch in components, Open HR uses a lightweight query/mutation hook creator with tag invalidation:

### Creating Query Hooks

In `src/features/<module>/api.ts`:

```typescript
import { createQueryHook, createMutationHook, apiRequest } from "@/lib/api-client";
import { TPagination } from "@/types";

export const useGetAssetsQuery = createQueryHook<
  TAssetState,
  TPagination & { employee_id?: string }
>(({ page, limit, search, employee_id }) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search: String(search ?? ""),
  });
  if (employee_id) params.set("employee_id", employee_id);

  return apiRequest<TAssetState>({
    url: `/asset?${params.toString()}`,
    method: "GET",
  });
}, ["asset"]); // Tag for cache invalidation
```

### Creating Mutation Hooks with Tag Invalidation

```typescript
export const useCreateAssetMutation = createMutationHook<TAsset, Partial<TAsset>>(
  (payload) =>
    apiRequest<TAsset>({
      url: "/asset",
      method: "POST",
      body: payload,
    }),
  ["asset"] // Invalidation tags: re-fetches any active useGetAssetsQuery automatically!
);
```

### Component Usage

```tsx
const { data, isLoading } = useGetAssetsQuery({ page: 1, limit: 10 });
const [createAsset, { isLoading: isCreating }] = useCreateAssetMutation();

const handleAdd = async () => {
  const result = await createAsset({ name: "MacBook Pro" }).unwrap();
  toast.success("Asset added");
};
```
