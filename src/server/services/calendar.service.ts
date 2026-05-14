import { localDate } from "@/lib/date-converter";
import { Calendar, Setting } from "@/server/models/module.model";

const getWeekendsFromSettings = async () => {
  const setting = await Setting.findOne().exec();
  return {
    weekends: (setting?.weekends ?? []) as string[],
    conditionalWeekends: (setting?.conditional_weekends ?? []) as {
      name: string;
      pattern: number[];
    }[],
  };
};

const buildWeekendObjects = (
  year: number,
  weekends: string[],
  conditionalWeekends: { name: string; pattern: number[] }[],
) => {
  const result: any[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
    let isWeekend = weekends.includes(dayName);

    if (!isWeekend) {
      const cw = conditionalWeekends.find((c) => c.name === dayName);
      if (cw) {
        const firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
        const weekNumber = Math.ceil((d.getDate() + firstDayOfMonth.getDay()) / 7);
        if (cw.pattern.includes(weekNumber)) isWeekend = true;
      }
    }

    if (isWeekend) {
      result.push({
        start_date: new Date(d),
        end_date: new Date(d),
        day_count: 1,
        reason: "Weekend",
      });
    }
  }
  return result;
};

export const getAllCalendarService = async () => {
  return Calendar.find();
};

export const getCalendarService = async (year: number) => {
  const calendar = await Calendar.findOne({ year });
  if (!calendar) return null;

  const calObj = calendar.toObject() as any;

  calObj.holidays = (calObj.holidays ?? []).sort(
    (a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
  );
  calObj.events = (calObj.events ?? []).sort(
    (a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
  );

  const { weekends, conditionalWeekends } = await getWeekendsFromSettings();
  calObj.weekends = buildWeekendObjects(year, weekends, conditionalWeekends);

  return calObj;
};

const normalizeDates = (items: any[]) =>
  (items ?? []).map((item: any) => ({
    ...item,
    start_date: localDate(new Date(item.start_date)),
    end_date: localDate(new Date(item.end_date)),
  }));

export const createCalendarService = async (data: any) => {
  const payload = {
    ...data,
    holidays: normalizeDates(data.holidays),
    events: normalizeDates(data.events),
  };
  return Calendar.create(payload);
};

export const updateCalendarService = async (year: string, data: any) => {
  const payload = {
    ...data,
    holidays: normalizeDates(data.holidays),
    events: normalizeDates(data.events),
  };
  return Calendar.findOneAndUpdate({ year: Number(year) }, payload, {
    returnDocument: "after",
  });
};

export const deleteCalendarService = async (year: string) => {
  return Calendar.findOneAndDelete({ year: Number(year) });
};

export const getUpcomingEventsAndHolidaysService = async (currentDate: Date) => {
  const year = currentDate.getFullYear();
  const nextMonth = new Date(currentDate);
  nextMonth.setDate(currentDate.getDate() + 30);

  const calendar = await Calendar.findOne({ year }) as any;
  if (!calendar) return { holidays: [], events: [] };

  const inRange = (item: any) => {
    const start = new Date(item.start_date);
    const end = new Date(item.end_date);
    return (
      (start >= currentDate && start <= nextMonth) ||
      (end >= currentDate && end <= nextMonth)
    );
  };

  const byStartDate = (a: any, b: any) =>
    new Date(a.start_date).getTime() - new Date(b.start_date).getTime();

  return {
    holidays: (calendar.holidays ?? []).filter(inRange).sort(byStartDate),
    events: (calendar.events ?? []).filter(inRange).sort(byStartDate),
  };
};
