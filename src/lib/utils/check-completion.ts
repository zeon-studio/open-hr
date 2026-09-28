import { TEmployee } from "@/types/employee";

export function checkCompletion(data: TEmployee) {
  if (!data) {
    return;
  }
  const completedSteps = [];

  if (data?.work_email) {
    completedSteps.push(1);
  }

  if (data?.password) {
    completedSteps.push(2);
  }

  if (data?.communication_id) {
    completedSteps.push(3);
  }

  const requiredFields: (keyof TEmployee)[] = [
    "name",
    "personal_email",
    "dob",
    "nid",
    "phone",
    "gender",
    "blood_group",
    "blood_donor",
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

  if (data.personality) {
    completedSteps.push(5);
  }

  return completedSteps;
}
