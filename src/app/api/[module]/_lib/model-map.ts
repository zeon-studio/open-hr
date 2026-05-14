import {
  Asset,
  Course,
  EmployeeAchievement,
  EmployeeBank,
  EmployeeContact,
  EmployeeDocument,
  EmployeeEducation,
  EmployeeJob,
  EmployeeOffboarding,
  EmployeeOnboarding,
  Payroll,
  Tool,
} from "@/server/models/module.model";

const modelMap: Record<string, any> = {
  "employee-achievement": EmployeeAchievement,
  "employee-bank": EmployeeBank,
  "employee-contact": EmployeeContact,
  "employee-document": EmployeeDocument,
  "employee-education": EmployeeEducation,
  "employee-job": EmployeeJob,
  "employee-offboarding": EmployeeOffboarding,
  "employee-onboarding": EmployeeOnboarding,
  payroll: Payroll,
  asset: Asset,
  course: Course,
  tool: Tool,
};

export const VALID_MODULES = Object.keys(modelMap);

export const getModel = (name: string) => modelMap[name];

export const listSearchFields: Record<string, string[]> = {
  "employee-achievement": ["employee_id", "achievements.title"],
  "employee-bank": ["employee_id", "account_name", "bank_name"],
  "employee-contact": ["employee_id", "phone", "email"],
  "employee-document": ["employee_id", "documents.name"],
  "employee-education": ["employee_id", "degree", "institute"],
  "employee-job": ["employee_id", "designation", "department"],
  "employee-offboarding": ["employee_id"],
  "employee-onboarding": ["employee_id"],
  payroll: ["employee_id"],
  asset: ["asset_id", "employee_id", "name"],
  course: ["employee_id", "course_name"],
  tool: ["employee_id", "tool_name"],
};
