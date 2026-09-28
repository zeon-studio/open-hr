import { differenceInDays, endOfDay, startOfDay } from "date-fns";

export const dayCounter = async (startDate: Date, endDate: Date) => {
  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required");
  }

  if (startDate > endDate) {
    throw new Error("Start date cannot be after end date");
  }

  const start = startOfDay(startDate);
  const end = endOfDay(endDate);
  const totalDays = differenceInDays(end, start) + 1;
  return Math.max(0, totalDays);
};

export function calculateRemainingLeave(
  joinDate: string | Date,
  leaveAllottedPerYear: number,
): number {
  if (!joinDate || typeof leaveAllottedPerYear !== "number") {
    throw new Error("Join date and leave allotted per year are required");
  }

  if (leaveAllottedPerYear < 0) {
    throw new Error("Leave allotted per year must be non-negative");
  }

  const joinDateObj = new Date(joinDate);
  const currentYear = joinDateObj.getFullYear();

  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31);
  const totalDaysInYear =
    (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24) + 1;

  const daysWorked =
    (endOfYear.getTime() - joinDateObj.getTime()) / (1000 * 60 * 60 * 24) + 1;

  const remainingLeave = (daysWorked / totalDaysInYear) * leaveAllottedPerYear;
  return Math.round((remainingLeave * 100) / 100);
}
