import mongoose, { Model } from "mongoose";

type ListOptions = {
  page?: number;
  limit?: number;
  search?: string;
  searchFields?: string[];
  extraFilter?: Record<string, unknown>;
};

const toPagination = (page = 1, limit = 10) => {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
  const skip = (safePage - 1) * safeLimit;
  return { safePage, safeLimit, skip };
};

export const listDocuments = async (
  model: Model<any>,
  options: ListOptions = {},
) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    searchFields = [],
    extraFilter = {},
  } = options;
  const { safeLimit, skip } = toPagination(page, limit);

  const filter: Record<string, unknown> = { ...extraFilter };
  if (search && searchFields.length) {
    filter.$or = searchFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  const [result, total] = await Promise.all([
    model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
    model.countDocuments(filter),
  ]);

  return {
    result,
    meta: {
      total,
    },
  };
};

export const getByIdOrField = async (
  model: Model<any>,
  value: string,
  fields: string[] = ["_id"],
) => {
  const numericValue = value !== "" && !isNaN(Number(value)) ? Number(value) : null;

  const conditions = fields
    .filter((field) => field !== "_id" || mongoose.Types.ObjectId.isValid(value))
    .map((field) => ({
      [field]: field !== "_id" && numericValue !== null ? numericValue : value,
    }));

  if (conditions.length === 0) return null;
  return model.findOne({ $or: conditions }).lean();
};

export const createDocument = async (model: Model<any>, payload: any) => {
  const created = await model.create(payload);
  return created;
};

export const upsertByField = async (
  model: Model<any>,
  key: string,
  value: string,
  payload: Record<string, unknown>,
) => {
  return model.findOneAndUpdate(
    { [key]: value },
    { $set: payload },
    { upsert: true, new: true },
  );
};

export const deleteByFields = async (
  model: Model<any>,
  filter: Record<string, unknown>,
) => {
  return model.findOneAndDelete(filter);
};
