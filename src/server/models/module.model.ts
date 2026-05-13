import mongoose, { Schema, SchemaDefinition } from "mongoose";

const createLooseModel = (name: string, indexedFields: string[] = []) => {
  const schemaDefinition: SchemaDefinition = {};
  indexedFields.forEach((field) => {
    schemaDefinition[field] = { type: String, index: true };
  });

  const schema = new Schema(schemaDefinition, {
    timestamps: true,
    strict: false,
  });

  return mongoose.models[name] || mongoose.model(name, schema);
};

export const EmployeeAchievement = createLooseModel("EmployeeAchievement", [
  "employee_id",
]);
export const EmployeeBank = createLooseModel("EmployeeBank", ["employee_id"]);
export const EmployeeContact = createLooseModel("EmployeeContact", [
  "employee_id",
]);
export const EmployeeDocument = createLooseModel("EmployeeDocument", [
  "employee_id",
]);
export const EmployeeEducation = createLooseModel("EmployeeEducation", [
  "employee_id",
]);
export const EmployeeJob = createLooseModel("EmployeeJob", ["employee_id"]);
export const EmployeeOffboarding = createLooseModel("EmployeeOffboarding", [
  "employee_id",
]);
export const EmployeeOnboarding = createLooseModel("EmployeeOnboarding", [
  "employee_id",
]);
export const Leave = createLooseModel("Leave", ["employee_id"]);
export const LeaveRequest = createLooseModel("LeaveRequest", ["employee_id"]);
export const Payroll = createLooseModel("Payroll", ["employee_id"]);
export const Asset = createLooseModel("Asset", ["asset_id", "employee_id"]);
export const Calendar = createLooseModel("Calendar", ["year"]);
export const Course = createLooseModel("Course", ["employee_id"]);
export const Tool = createLooseModel("Tool", ["employee_id"]);

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
