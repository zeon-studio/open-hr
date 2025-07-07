import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarHeader,
  CalendarItem,
  CalendarProvider,
} from "@/layouts/components/ui/kibo-calendar";
import { TEvent } from "@/redux/features/calendarApiSlice/calendarType";
import { useMemo } from "react";

const CalendarView = ({ yearlyData }: { yearlyData: TEvent[] }) => {
  const features = useMemo(() => {
    return yearlyData?.map((event, idx) => {
      const type = (event.type as "holiday" | "event" | "weekend") ?? "event";
      return {
        id: String(idx),
        name: event.reason,
        startAt: new Date(event.start_date!),
        endAt: new Date(event.end_date!),
        status: {
          id: type,
          name: type,
        },
      };
    });
  }, [yearlyData]);

  return (
    <CalendarProvider locale="en-US" startDay={0}>
      <CalendarDate>
        <CalendarDatePagination />
      </CalendarDate>
      <CalendarHeader />
      <CalendarBody features={features}>
        {({ feature }) => <CalendarItem feature={feature} />}
      </CalendarBody>
    </CalendarProvider>
  );
};

export default CalendarView;
