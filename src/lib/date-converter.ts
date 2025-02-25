import {
  differenceInDays,
  Duration,
  formatDistance,
  intervalToDuration,
} from "date-fns";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const dateFormat = (
  date: Date | string,
  timeZoneOffset: number = 6,
  showTime: boolean = false
): string => {
  if (!date) return "";

  // Convert date string to Date object if needed
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Adjust for timezone offset
  const adjustedDate = new Date(
    dateObj.getTime() + timeZoneOffset * 60 * 60 * 1000
  )?.toISOString();

  // Extract day, month, and year
  const day = adjustedDate.slice(8, 10);
  const month = monthNames[Number(adjustedDate.slice(5, 7)) - 1];
  const year = adjustedDate.slice(0, 4);

  // Construct formatted date string
  let formattedDate = `${day} ${month}, ${year}`;

  if (showTime) {
    const hours = Number(adjustedDate.slice(11, 13));
    const minutes = adjustedDate.slice(14, 16);
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours > 12 ? hours - 12 : hours;
    formattedDate += ` ${formattedHours < 10 ? "0" + formattedHours : formattedHours}:${minutes} ${ampm}`;
  }

  return formattedDate;
};

export const dateDistance = (date: string) => {
  const currentDate = new Date();

  return formatDistance(currentDate, new Date(date));
};

export function getDuration(
  startDate: string | Date,
  endDate: string | Date
): Duration {
  const duration = intervalToDuration({
    start: new Date(startDate),
    end: new Date(endDate),
  });
  return duration;
}

export const dayCount = (startDate: string | Date, endDate: string | Date) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Normalize time to 00:00:00
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return differenceInDays(end, start) + 1;
};
