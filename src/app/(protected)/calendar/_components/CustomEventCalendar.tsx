import { Calendar } from "@/components/ui/calendar";
import { TEvent } from "@/redux/features/calendarApiSlice/calendarType";
import { useEffect, useRef, useState } from "react";
import Marquee from "react-fast-marquee";

const CustomEventCalendar = ({ events }: { events: TEvent[] }) => {
  const getEventsForDate = (date: Date) => {
    return events?.filter((event) => {
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);

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
          className={`${event?.type === "holiday" ? "bg-rose-100 border-l-2 border-l-rose-500" : "bg-blue-100 border-l-2 border-l-blue-500"} rounded-md py-1.5 px-1.5 mb-0.5`}
        >
          <div
            ref={badgeRef}
            className={`text-xs ${event?.type === "holiday" ? "text-rose-500" : "text-blue-500"} text-center overflow-hidden whitespace-nowrap`}
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
    <Calendar
      mode="single"
      className="rounded-md w-full p-0 "
      classNames={{
        button: "flex jucetify-center items-center w-[100%]",
        months:
          "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
        caption:
          "relative md:w-[30%] lg:w-[25%] xl:w-[20%] ml-auto text-center bg-background px-6 py-2.5 border border-muted rounded-md",
        month: "space-y-4 w-full flex flex-col",
        day: "h-20 p-0 hover:text-unset cursor-default",
        day_today: "bg-transparent text-blue-500",
        table:
          "w-full h-full border-collapse bg-background overflow-hidden rounded-t-md",
        head_row: "bg-dark",
        head_cell: "font-normal text-white",
        row: "w-full",
        cell: "w-[14.2857%] relative border border-gray-300",
        nav_button: "opacity-100 w-fit border-none",
        nav_button_previous:
          "absolute left-2 top-1/2 transform -translate-y-1/2",
        nav_button_next: "absolute right-2 top-1/2 transform -translate-y-1/2",
      }}
      modifiers={{
        hasEvent: (date) => getEventsForDate(date)?.length > 0,
      }}
      components={{
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

export default CustomEventCalendar;
