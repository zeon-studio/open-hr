import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { dateFormat, dayCount } from "@/lib/dateFormat";
import {
  TCalendar,
  TEvent,
} from "@/redux/features/calendarApiSlice/calendarType";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const CalendarForm = ({
  calendarData,
  setCalendarData,
  handleSubmit,
  buttonText,
  loader,
  mode,
}: {
  calendarData: Partial<TCalendar>;
  setCalendarData: Dispatch<SetStateAction<TCalendar>>;
  handleSubmit: (e: any) => Promise<void>;
  buttonText: string;
  loader: boolean;
  mode: string;
}) => {
  const [year, setYear] = useState(
    calendarData?.year || new Date().getFullYear()
  );
  const [holidayItems, setHolidayItems] = useState<TEvent[]>(
    calendarData?.holidays || []
  );
  const [eventItems, setEventItems] = useState<TEvent[]>(
    calendarData?.events || []
  );
  const [holidayDateRange, setHolidayDateRange] = useState<
    DateRange | undefined
  >({
    from: calendarData.holidays?.[0]?.start_date
      ? new Date(calendarData.holidays[0].start_date)
      : undefined,
    to: calendarData.holidays?.[0]?.end_date
      ? new Date(calendarData.holidays[0].end_date)
      : undefined,
  });
  const [eventDateRange, setEventDateRange] = useState<DateRange | undefined>({
    from: calendarData.events?.[0]?.start_date
      ? new Date(calendarData.events[0].start_date)
      : undefined,
    to: calendarData.events?.[0]?.end_date
      ? new Date(calendarData.events[0].end_date)
      : undefined,
  });

  useEffect(() => {
    if (
      mode === "update" &&
      (calendarData?.year !== year ||
        JSON.stringify(calendarData?.holidays) !==
          JSON.stringify(holidayItems) ||
        JSON.stringify(calendarData?.events) !== JSON.stringify(eventItems))
    ) {
      setYear(calendarData?.year || new Date().getFullYear());
      setHolidayItems(calendarData?.holidays || []);
      setEventItems(calendarData?.events || []);
      setHolidayDateRange({
        from: calendarData.holidays?.[0]?.start_date
          ? new Date(calendarData.holidays[0].start_date)
          : undefined,
        to: calendarData.holidays?.[0]?.end_date
          ? new Date(calendarData.holidays[0].end_date)
          : undefined,
      });
      setEventDateRange({
        from: calendarData.events?.[0]?.start_date
          ? new Date(calendarData.events[0].start_date)
          : undefined,
        to: calendarData.events?.[0]?.end_date
          ? new Date(calendarData.events[0].end_date)
          : undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarData, mode]);

  useEffect(() => {
    setCalendarData((prev) => ({
      ...prev,
      year: year,
      holidays: holidayItems.map((item) => ({
        start_date: holidayDateRange?.from
          ? format(holidayDateRange.from, "yyyy-MM-dd")
          : new Date().toISOString().split("T")[0],
        end_date: holidayDateRange?.to
          ? format(holidayDateRange.to, "yyyy-MM-dd")
          : new Date().toISOString().split("T")[0],
        day_count: dayCount(
          new Date(holidayDateRange?.from!),
          new Date(holidayDateRange?.to!)
        ),
        reason: item.reason,
      })),
      events: eventItems.map((item) => ({
        start_date: eventDateRange?.from
          ? format(eventDateRange.from, "yyyy-MM-dd")
          : new Date().toISOString().split("T")[0],
        end_date: eventDateRange?.to
          ? format(eventDateRange.to, "yyyy-MM-dd")
          : new Date().toISOString().split("T")[0],
        day_count: dayCount(
          new Date(eventDateRange?.from!),
          new Date(eventDateRange?.to!)
        ),
        reason: item.reason,
      })),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holidayItems, eventItems]);

  useEffect(() => {
    setCalendarData((prev) => ({
      ...prev,
      holidays: holidayItems.map((item) => ({
        ...item,
        start_date: holidayDateRange?.from
          ? format(holidayDateRange.from, "yyyy-MM-dd")
          : new Date().toISOString().split("T")[0],
        end_date: holidayDateRange?.to
          ? format(holidayDateRange.to, "yyyy-MM-dd")
          : new Date().toISOString().split("T")[0],
      })),
      events: eventItems.map((item) => ({
        ...item,
        start_date: eventDateRange?.from
          ? format(eventDateRange.from, "yyyy-MM-dd")
          : new Date().toISOString().split("T")[0],
        end_date: eventDateRange?.to
          ? format(eventDateRange.to, "yyyy-MM-dd")
          : new Date().toISOString().split("T")[0],
      })),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holidayDateRange, eventDateRange]);

  // holiday
  const handleAddHoliday = () => {
    setHolidayItems([
      ...holidayItems,
      {
        start_date: new Date(),
        end_date: new Date(),
        day_count: 0,
        reason: "",
      },
    ]);
  };
  const handleDeleteHoliday = async (index: number) => {
    setHolidayItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // event
  const handleAddEvent = () => {
    setEventItems([
      ...eventItems,
      {
        start_date: new Date(),
        end_date: new Date(),
        day_count: 0,
        reason: "",
      },
    ]);
  };
  const handleDeleteEvent = async (index: number) => {
    setEventItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <form className="row" onSubmit={handleSubmit}>
      {mode === "insert" && (
        <div className="col-12 mb-4">
          <Label>Year</Label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            placeholder="Enter calendar year"
          />
        </div>
      )}
      <div className="col-12 mb-6">
        <h5 className="mb-4">Holiday</h5>
        {holidayItems.map((holiday, index) => (
          <div
            key={index}
            className="border relative mb-6 bg-light rounded-md p-3"
          >
            <div className="absolute right-3 top-3">
              <Button
                type="button"
                onClick={() => handleDeleteHoliday(index)}
                size={"xs"}
                variant="outline"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <div className="row">
              <div className="col-12 mb-4">
                <Label>Reason</Label>
                <Input
                  type="text"
                  value={holiday.reason}
                  onChange={(e) => {
                    const updatedHolidayItems = [...holidayItems];

                    updatedHolidayItems[index] = {
                      ...holiday,
                      reason: e.target.value,
                    };
                    setHolidayItems(updatedHolidayItems);
                  }}
                  placeholder="Holiday Reason"
                />
              </div>
              <div className="w-full">
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"input"}
                      className="w-full flex justify-between"
                    >
                      {holidayDateRange?.from ? (
                        holidayDateRange.to ? (
                          <>
                            {format(holidayDateRange.from, "dd/MM/yyyy")} -{" "}
                            {format(holidayDateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(holidayDateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <span className="flex items-center">
                        <span className="bg-border/30 mb-2 mt-2 h-5 block w-[1px]"></span>
                        <span className="pl-2  block">
                          <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                        </span>
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      numberOfMonths={2}
                      selected={holidayDateRange}
                      onSelect={setHolidayDateRange}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={handleAddHoliday}
          size={"sm"}
          className="w-full"
          variant="outline"
        >
          Add Holiday
        </Button>
      </div>
      {/* event */}
      <div className="col-12 mb-6">
        <h5 className="mb-4">Events</h5>
        {eventItems.map((event, index) => (
          <div
            key={index}
            className="border relative mb-6 bg-light rounded-md p-3"
          >
            <div className="absolute right-3 top-3">
              <Button
                type="button"
                onClick={() => handleDeleteEvent(index)}
                size={"xs"}
                variant="outline"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <div className="row">
              <div className="col-12 mb-4">
                <Label>Reason</Label>
                <Input
                  type="text"
                  value={event.reason}
                  onChange={(e) => {
                    const updatedEventItems = [...eventItems];

                    updatedEventItems[index] = {
                      ...event,
                      reason: e.target.value,
                    };
                    setEventItems(updatedEventItems);
                  }}
                  placeholder="Event Reason"
                />
              </div>
              <div className="w-full">
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"input"}
                      className="w-full flex justify-between"
                    >
                      {eventDateRange?.from ? (
                        eventDateRange.to ? (
                          <>
                            {dateFormat(eventDateRange.from)} -{" "}
                            {dateFormat(eventDateRange.to)}
                          </>
                        ) : (
                          dateFormat(eventDateRange.from)
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <span className="flex items-center">
                        <span className="bg-border/30 mb-2 mt-2 h-5 block w-[1px]"></span>
                        <span className="pl-2  block">
                          <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                        </span>
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      numberOfMonths={2}
                      selected={eventDateRange}
                      onSelect={setEventDateRange}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={handleAddEvent}
          size={"sm"}
          className="w-full"
          variant="outline"
        >
          Add Event
        </Button>
      </div>
      <div className="col-12 text-right">
        <Button disabled={loader}>
          {loader ? (
            <>
              Please wait
              <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
            </>
          ) : (
            buttonText
          )}
        </Button>
      </div>
    </form>
  );
};

export default CalendarForm;
