import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dateFormat } from "@/lib/dateFormat";
import { useGetUpcomingHolidaysAndEventsQuery } from "@/redux/features/calendarApiSlice/calendarSlice";
import { TEvent } from "@/redux/features/calendarApiSlice/calendarType";
import { CalendarCheck } from "lucide-react";

const UpcomingEvents = () => {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = useGetUpcomingHolidaysAndEventsQuery(today);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <CalendarCheck className="mr-2 inline-block" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:h-[300px] scroll-box">
        {data?.result?.events?.length === 0 ? (
          <p className="text-text-light">No upcoming events</p>
        ) : (
          <ul className="space-y-3">
            {data?.result?.events?.map((event: TEvent, index: number) => (
              <li
                className="bg-success/10 px-3 py-2 rounded"
                key={`event-${index}`}
              >
                <p className="capitalize text-success block">{event.reason}</p>
                <small className="text-text-light">
                  {dateFormat(event.start_date)} - {dateFormat(event.end_date)}
                </small>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
