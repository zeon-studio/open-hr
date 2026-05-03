import type { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { hasGravatarByEmail } from "./gravatar";

// Fields that count toward the profile completion percentage. Equal weight per field.
// The label is shown to the user when listing missing fields.
const SCORED_FIELDS: { key: keyof TEmployee; label: string }[] = [
  { key: "name", label: "Full Name" },
  { key: "image", label: "Profile Photo" },
  { key: "phone", label: "Mobile Phone" },
  { key: "work_email", label: "Work Email" },
  { key: "personal_email", label: "Personal Email" },
  { key: "dob", label: "Date of Birth" },
  { key: "gender", label: "Gender" },
  { key: "present_address", label: "Present Address" },
  { key: "permanent_address", label: "Permanent Address" },
  { key: "blood_group", label: "Blood Group" },
  { key: "marital_status", label: "Marital Status" },
  { key: "nid", label: "NID" },
  { key: "designation", label: "Designation" },
  { key: "department", label: "Department" },
];

const isFilled = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
};

export function profileCompletion(employee?: Partial<TEmployee> | null): {
  filled: number;
  total: number;
  percent: number;
  missing: string[];
} {
  const total = SCORED_FIELDS.length;
  if (!employee) {
    return {
      filled: 0,
      total,
      percent: 0,
      missing: SCORED_FIELDS.map((f) => f.label),
    };
  }
  const missing: string[] = [];
  let filled = 0;
  for (const { key, label } of SCORED_FIELDS) {
    // Special handling for image field - check if uploaded or has gravatar
    if (key === "image") {
      const hasUploadedImage = isFilled(employee[key]);
      const hasGravatarPhoto = employee.photo_source === "gravatar";
      if (hasUploadedImage || hasGravatarPhoto) {
        filled += 1;
      } else {
        missing.push(label);
      }
    } else if (isFilled(employee[key])) {
      filled += 1;
    } else {
      missing.push(label);
    }
  }
  return {
    filled,
    total,
    percent: Math.round((filled / total) * 100),
    missing,
  };
}

/**
 * Async version of profileCompletion that checks Gravatar if needed
 */
export async function profileCompletionAsync(
  employee?: Partial<TEmployee> | null,
): Promise<{
  filled: number;
  total: number;
  percent: number;
  missing: string[];
}> {
  const total = SCORED_FIELDS.length;
  if (!employee) {
    return {
      filled: 0,
      total,
      percent: 0,
      missing: SCORED_FIELDS.map((f) => f.label),
    };
  }

  const missing: string[] = [];
  let filled = 0;

  for (const { key, label } of SCORED_FIELDS) {
    // Special handling for image field - check if uploaded or has gravatar
    if (key === "image") {
      const hasUploadedImage = isFilled(employee[key]);
      if (hasUploadedImage) {
        filled += 1;
      } else {
        // Check if gravatar exists for the user's work email
        const hasGravatar =
          employee.work_email &&
          (await hasGravatarByEmail(employee.work_email));
        if (hasGravatar) {
          filled += 1;
        } else {
          missing.push(label);
        }
      }
    } else if (isFilled(employee[key])) {
      filled += 1;
    } else {
      missing.push(label);
    }
  }

  return {
    filled,
    total,
    percent: Math.round((filled / total) * 100),
    missing,
  };
}
