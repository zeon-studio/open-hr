import { TEvent } from "@/redux/features/calendarApiSlice/calendarType";
import { CalendarFullView } from "@/ui/calendar-fullview";
import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";

const CalendarView = ({ yearlyData }: { yearlyData: TEvent[] }) => {
  const customWeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventsForDate = (date: Date) => {
    return yearlyData?.filter((item) => {
      const startDate = new Date(item.start_date!);
      const endDate = new Date(item.end_date!);

      // Adjust dates to ignore time
      const targetDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const eventStart = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      const eventEnd = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      );

      return targetDate >= eventStart && targetDate <= eventEnd;
    });
  };

  // Custom day render function
  const renderDay = (day: Date) => {
    const dayEvents = getEventsForDate(day);
    if (dayEvents?.length === 0) return null;

    // Component to dynamically check text overflow
    const EventBadge = ({ event }: { event: TEvent }) => {
      const badgeRef = useRef<HTMLDivElement>(null);
      const [isOverflowing, setIsOverflowing] = useState(false);

      useEffect(() => {
        if (badgeRef.current) {
          const { scrollWidth, clientWidth } = badgeRef.current;
          setIsOverflowing(scrollWidth > clientWidth);
        }
      }, [event.reason]);
      return (
        <div
          className={
            event?.type === "holiday"
              ? "bg-destructive sm:bg-destructive/10 border-l-2 border-l-destructive rounded-md py-0.5 sm:py-1.5 px-1.5 mb-0.5"
              : event?.type === "weekend"
                ? "bg-warning sm:bg-warning/10 border-l-2 border-l-warning rounded-md py-0.5 sm:py-1.5 px-1.5 mb-0.5"
                : "bg-success sm:bg-success/10 border-l-2 border-l-success rounded-md py-0.5 sm:py-1.5 px-1.5 mb-0.5"
          }
        >
          <div
            ref={badgeRef}
            className={`hidden sm:block text-xs ${
              event?.type === "holiday"
                ? "text-destructive"
                : event?.type === "weekend"
                  ? "text-warning"
                  : "text-success"
            } text-center overflow-hidden whitespace-nowrap`}
            style={{ maxWidth: "100%" }}
          >
            {isOverflowing ? (
              <Marquee speed={15} pauseOnHover className="w-full">
                {event.reason}
              </Marquee>
            ) : (
              event.reason
            )}
          </div>
        </div>
      );
    };

    return (
      <>
        {dayEvents?.map((event, index) => (
          <EventBadge key={index} event={event} />
        ))}
      </>
    );
  };

  return (
    <CalendarFullView
      mode="single"
      className="rounded-md w-full p-0"
      classNames={{
        button: "flex justify-center items-center w-[100%]",
        months:
          "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
        caption:
          "relative w-full sm:w-[30%] lg:w-[25%] xl:w-[20%] ml-auto text-center bg-background px-6 py-2.5 border border-muted rounded-md overflow-hidden",
        month: "space-y-4 w-full flex flex-col",
        day: "h-10 sm:h-28 p-0 hover:text-unset cursor-default",
        day_today: "bg-light",
        table:
          "w-full h-full border-collapse bg-background overflow-hidden rounded-t-md",
        head_cell: "font-normal text-white",
        row: "w-full",
        cell: "w-[14.2857%] relative border border-gray-300",
        nav_button: "h-full !w-[20%] opacity-100 cursor-pointer",
        nav_button_previous:
          "absolute left-0 top-1/2 transform -translate-y-1/2",
        nav_button_next: "absolute right-0 top-1/2 transform -translate-y-1/2",
      }}
      components={{
        Head: () => (
          <thead>
            <tr className="bg-dark h-9">
              {customWeekDays.map((dayName) => (
                <th
                  key={dayName}
                  className={`border-r border-border last:border-0 font-normal text-white`}
                >
                  {dayName}
                </th>
              ))}
            </tr>
          </thead>
        ),
        DayContent: ({ date }) => (
          <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {date.getDate()}
            {renderDay(date)}
          </div>
        ),
      }}
    />
  );
};

export default CalendarView;
