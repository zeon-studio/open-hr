import { dateFormat } from "@/lib/date-converter";
import { useGetUpcomingHolidaysAndEventsQuery } from "@/redux/features/calendarApiSlice/calendarSlice";
import { TEvent } from "@/redux/features/calendarApiSlice/calendarType";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Calendar1 } from "lucide-react";

const UpcomingHolidays = () => {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = useGetUpcomingHolidaysAndEventsQuery(today);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <Calendar1 className="mr-2 inline-block" />
          Upcoming Holidays
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:h-[300px] scroll-box">
        {data?.result?.holidays?.length === 0 ? (
          <p className="text-text-light">No upcoming holidays</p>
        ) : (
          <ul className="space-y-3">
            {data?.result?.holidays?.map((holiday: TEvent, index: number) => (
              <li
                className="bg-destructive/10 px-3 py-2 rounded"
                key={`holiday-${index}`}
              >
                <p className="capitalize text-destructive block">
                  {holiday.reason}
                </p>
                <small className="text-text-light">
                  {dateFormat(holiday.start_date!)} -{" "}
                  {dateFormat(holiday.end_date!)}
                </small>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingHolidays;
