import { add, format } from "date-fns";

export const formatDate = (
  date: string | number | Date,
  pattern = "EEEE, dd MMMM, yyyy",
) => {
  if (!date) return;
  return format(new Date(date), pattern);
};

export const localDate = (date: Date) => {
  const utcDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  return add(utcDate, { hours: 0 });
};

export const isOneYearPassed = (prevDate: Date, currentDate: Date) => {
  const oneYearLater = new Date(prevDate);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  return (
    oneYearLater.getFullYear() < currentDate.getFullYear() ||
    (oneYearLater.getFullYear() === currentDate.getFullYear() &&
      oneYearLater.getMonth() < currentDate.getMonth()) ||
    (oneYearLater.getFullYear() === currentDate.getFullYear() &&
      oneYearLater.getMonth() === currentDate.getMonth() &&
      oneYearLater.getDate() <= currentDate.getDate())
  );
};
