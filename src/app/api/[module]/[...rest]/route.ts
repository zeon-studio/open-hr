import { apiError, apiSuccess } from "@/server/utils/api-response";
import {
  deleteByFields,
  getByIdOrField,
  upsertByField,
} from "@/server/services/module.service";
import { NextRequest } from "next/server";
import { withDb } from "../../_lib/handler";
import { getModel, VALID_MODULES } from "../_lib/model-map";

type Context = { params: Promise<{ module: string; rest: string[] }> };

export async function GET(request: NextRequest, context: Context) {
  return withDb(async () => {
    const { module: moduleName, rest } = await context.params;

    if (!VALID_MODULES.includes(moduleName)) {
      return apiError("Route not found", 404);
    }

    const model = getModel(moduleName);

    if (rest[0] === "pending-task") {
      const data = await model.aggregate([
        { $unwind: "$tasks" },
        { $match: { "tasks.status": "pending" } },
        {
          $project: {
            _id: 0,
            employee_id: 1,
            createdAt: 1,
            task_name: "$tasks.task_name",
            assigned_to: "$tasks.assigned_to",
            status: "$tasks.status",
          },
        },
      ]);
      return apiSuccess(data, "data get successfully");
    }

    if (rest[0] === "user" && rest[1]) {
      const userId = rest[1];

      if (moduleName === "course") {
        const docs = await model.find({
          "courses.users": { $in: [userId, "everyone"] },
        });
        const result = docs.flatMap((doc: any) =>
          (doc.courses ?? [])
            .filter(
              (c: any) =>
                (c.users ?? []).includes(userId) ||
                (c.users ?? []).includes("everyone"),
            )
            .map((c: any) => ({
              _id: c._id,
              name: c.name,
              price: c.price,
              purchase_date: c.purchase_date,
              expire_date: c.expire_date,
              platform: doc.platform,
              website: doc.website,
              email: doc.email,
              password: doc.password,
            })),
        );
        return apiSuccess(result, "data get successfully");
      }

      if (moduleName === "tool") {
        const docs = await model.find({
          "organizations.users": { $in: [userId, "everyone"] },
        });
        const result = docs.flatMap((doc: any) =>
          (doc.organizations ?? [])
            .filter(
              (org: any) =>
                (org.users ?? []).includes(userId) ||
                (org.users ?? []).includes("everyone"),
            )
            .map((org: any) => ({
              _id: org._id,
              name: org.name,
              login_id: org.login_id,
              password: org.password,
              purchase_date: org.purchase_date,
              expire_date: org.expire_date,
              platform: doc.platform,
              website: doc.website,
              status: org.status,
            })),
        );
        return apiSuccess(result, "data get successfully");
      }

      if (moduleName === "asset") {
        const result = await model.aggregate([
          { $match: { user: userId } },
          {
            $addFields: {
              handover: {
                $last: {
                  $filter: {
                    input: "$logs",
                    as: "log",
                    cond: { $eq: ["$$log.type", "handover"] },
                  },
                },
              },
            },
          },
          {
            $project: {
              asset_id: 1,
              user: 1,
              name: 1,
              type: 1,
              serial_number: 1,
              price: 1,
              currency: 1,
              purchase_date: 1,
              archive: 1,
              note: 1,
              handover: 1,
            },
          },
        ]);
        return apiSuccess(result, "data get successfully");
      }

      const data = await model.find({ employee_id: userId });
      return apiSuccess(data, "data get successfully");
    }

    if (rest[0] === "basics" && moduleName === "payroll") {
      const data = await model.find(
        {},
        { _id: 0, employee_id: 1, gross_salary: 1, status: 1 },
      );
      return apiSuccess(data, "data get successfully");
    }

    if (rest.length === 1) {
      const idFields = ["_id", "employee_id", "asset_id", "year"];
      const data = await getByIdOrField(model, rest[0], idFields);
      return apiSuccess(data, "data get successfully");
    }

    return apiError("Route not found", 404);
  });
}

export async function PATCH(request: NextRequest, context: Context) {
  return withDb(async () => {
    const { module: moduleName, rest } = await context.params;

    if (!VALID_MODULES.includes(moduleName)) {
      return apiError("Route not found", 404);
    }

    const model = getModel(moduleName);
    const body = await request.json().catch(() => ({}));

    if (rest[0] === "task" && rest[1] && rest[2]) {
      const updated = await model.findOneAndUpdate(
        {
          employee_id: rest[1],
          "tasks.task_name": decodeURIComponent(rest[2]),
        },
        { $set: { "tasks.$.status": "done" } },
        { new: true },
      );
      return apiSuccess(updated, "data updated successfully");
    }

    if (rest.length === 1) {
      let keyField = "employee_id";
      if (["asset"].includes(moduleName)) keyField = "asset_id";
      if (["course", "tool", "calendar"].includes(moduleName)) {
        keyField = "_id";
      }

      const updated = await upsertByField(model, keyField, rest[0], body);
      return apiSuccess(updated, "data updated successfully");
    }

    return apiError("Route not found", 404);
  });
}

export async function DELETE(_request: NextRequest, context: Context) {
  return withDb(async () => {
    const { module: moduleName, rest } = await context.params;

    if (!VALID_MODULES.includes(moduleName)) {
      return apiError("Route not found", 404);
    }

    const model = getModel(moduleName);

    if (moduleName === "employee-document" && rest.length === 2) {
      const updated = await model.findOneAndUpdate(
        { employee_id: rest[0] },
        { $pull: { documents: { _id: rest[1] } } },
        { new: true },
      );
      return apiSuccess(updated, "data deleted successfully");
    }

    if (rest.length === 1) {
      const deleted =
        (await deleteByFields(model, { _id: rest[0] })) ||
        (await deleteByFields(model, { employee_id: rest[0] })) ||
        (await deleteByFields(model, { asset_id: rest[0] })) ||
        (await deleteByFields(model, {
          year: Number(rest[0]) || rest[0],
        }));
      return apiSuccess(deleted, "data deleted successfully");
    }

    return apiError("Route not found", 404);
  });
}
