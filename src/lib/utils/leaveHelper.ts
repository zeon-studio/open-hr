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

