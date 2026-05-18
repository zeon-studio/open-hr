import mongoose, { Model, Schema } from "mongoose";

const createLooseModel = (name: string, indexedFields: string[] = []): Model<any> => {
  const schema = new Schema({}, { timestamps: true, strict: false });
  indexedFields.forEach((field) => schema.index({ [field]: 1 }));

  // Delete stale cached model so schema changes always take effect.
  delete (mongoose.models as Record<string, unknown>)[name];
  return mongoose.model(name, schema);
};

export const EmployeeAchievement = createLooseModel("employee_achievement", [
  "employee_id",
]);
export const EmployeeBank = createLooseModel("employee_bank", ["employee_id"]);
export const EmployeeContact = createLooseModel("employee_contact", [
  "employee_id",
]);
export const EmployeeDocument = createLooseModel("employee_document", [
  "employee_id",
]);
export const EmployeeEducation = createLooseModel("employee_education", [
  "employee_id",
]);
export const EmployeeJob = createLooseModel("employee_job", ["employee_id"]);
export const EmployeeOffboarding = createLooseModel("employee_offboarding", [
  "employee_id",
]);
export const EmployeeOnboarding = createLooseModel("employee_onboarding", [
  "employee_id",
]);
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

const SettingSchema = new Schema(
  {
    modules: { type: [Schema.Types.Mixed], default: [] },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export const Setting =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
