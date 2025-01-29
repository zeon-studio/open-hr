import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";

export function checkCompletion(data: TEmployee) {
  const completedSteps = [];

  // Step 1: Check if work_email exists
  if (data.work_email) {
    completedSteps.push(1);
  }

  // Step 2: Check if discord exists
  if (data.discord) {
    completedSteps.push(2);
  }

  // Step 3: Check if all required fields exist
  const requiredFields: (keyof TEmployee)[] = [
    "name",
    "work_email",
    "personal_email",
    "dob",
    "nid",
    "phone",
    "gender",
    "blood_group",
    "marital_status",
    "present_address",
    "permanent_address",
    "facebook",
    "twitter",
    "linkedin",
    "discord",
  ];

  const isStep3Complete = requiredFields.every((field) => data[field]);

  if (isStep3Complete) {
    completedSteps.push(3);
  }

  // Step 4: Check if personality exists
  if (data.personality) {
    completedSteps.push(4);
  }

  return completedSteps;
}
