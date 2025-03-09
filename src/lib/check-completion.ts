import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";

export function checkCompletion(data: TEmployee) {
  if (!data) {
    return;
  }
  const completedSteps = [];

  // Step 1: Check if work_email exists
  if (data?.work_email) {
    completedSteps.push(1);
  }

  // step 2: check password
  if (data?.password) {
    completedSteps.push(2);
  }

  // Step 3: Check if communication_id exists
  if (data?.communication_id) {
    completedSteps.push(3);
  }

  // Step 4: Check if all required fields exist
  const requiredFields: (keyof TEmployee)[] = [
    "name",
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
  ];

  const isStep4Complete = requiredFields.every((field) => {
    const exit = data[field];
    return exit;
  });

  if (isStep4Complete) {
    completedSteps.push(4);
  }

  // Step 5: Check if all required fields exist
  if (data.personality) {
    completedSteps.push(5);
  }

  return completedSteps;
}
