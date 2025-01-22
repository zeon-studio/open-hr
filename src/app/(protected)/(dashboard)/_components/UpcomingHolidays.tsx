import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dateFormat } from "@/lib/dateFormat";
import { useGetUpcomingHolidaysAndEventsQuery } from "@/redux/features/calendarApiSlice/calendarSlice";
import { TEvent } from "@/redux/features/calendarApiSlice/calendarType";
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
      <CardContent className="h-[300px] scroll-box">
        {data?.result?.holidays?.length === 0 ? (
          <p className="text-center py-4">No upcoming holidays</p>
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
                  {dateFormat(holiday.start_date)} -{" "}
                  {dateFormat(holiday.end_date)}
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
