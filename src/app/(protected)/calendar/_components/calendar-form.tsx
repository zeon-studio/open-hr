import { dateFormat, dayCount, formatDateWithTime } from "@/lib/date-converter";
import {
  TCalendar,
  TEvent,
} from "@/redux/features/calendarApiSlice/calendarType";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { CalendarIcon, Loader2, Trash2, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const CalendarForm = ({
  calendarData,
  setCalendarData,
  handleSubmit,
  loader,
  formType,
}: {
  calendarData: Partial<TCalendar>;
  setCalendarData: Dispatch<SetStateAction<TCalendar>>;
  handleSubmit: (e: any) => Promise<void>;
  loader: boolean;
  formType: string;
}) => {
  const [holidayItems, setHolidayItems] = useState<TEvent[]>(
    calendarData.holidays || []
  );

  const [eventItems, setEventItems] = useState<TEvent[]>(
    calendarData.events || []
  );

  // set holiday items
  useEffect(() => {
    setCalendarData((prev) => ({
      ...prev,
      holidays: holidayItems,
    }));
  }, [holidayItems, setCalendarData]);

  // set event items
  useEffect(() => {
    setCalendarData((prev) => ({
      ...prev,
      events: eventItems,
    }));
  }, [eventItems, setCalendarData]);

  // holiday
  const handleAddHoliday = () => {
    setHolidayItems([
      ...holidayItems,
      {
        start_date: undefined,
        end_date: undefined,
        day_count: 0,
        reason: "",
      },
    ]);
  };

  const handleDeleteHoliday = async (index: number) => {
    setHolidayItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleHolidayDateRangeChange = (index: number, range: DateRange) => {
    const updatedHolidayItems = [...holidayItems];
    updatedHolidayItems[index] = {
      ...updatedHolidayItems[index],
      start_date: range.from ? formatDateWithTime(range.from) : undefined,
      end_date: range.to
        ? formatDateWithTime(range.to)
        : range.from
          ? formatDateWithTime(range.from)
          : undefined,
      day_count:
        range.from && range.to
          ? dayCount(range.from, range.to)
          : range.from
            ? 1
            : 0,
    };
    setHolidayItems(updatedHolidayItems);
  };

  const handleRemoveHolidayDate = (index: number) => {
    const updatedHolidayItems = [...holidayItems];
    updatedHolidayItems[index] = {
      ...updatedHolidayItems[index],
      start_date: undefined,
      end_date: undefined,
    };
    setHolidayItems(updatedHolidayItems);
  };

  // event
  const handleAddEvent = () => {
    setEventItems([
      ...eventItems,
      {
        start_date: undefined,
        end_date: undefined,
        day_count: 0,
        reason: "",
      },
    ]);
  };

  const handleDeleteEvent = async (index: number) => {
    setEventItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleEventDateRangeChange = (index: number, range: DateRange) => {
    const updatedEventItems = [...eventItems];
    updatedEventItems[index] = {
      ...updatedEventItems[index],
      start_date: range.from ? formatDateWithTime(range.from) : undefined,
      end_date: range.to
        ? formatDateWithTime(range.to)
        : range.from
          ? formatDateWithTime(range.from)
          : undefined,
      day_count:
        range.from && range.to
          ? dayCount(range.from, range.to)
          : range.from
            ? 1
            : 0,
    };
    setEventItems(updatedEventItems);
  };

  const handleRemoveEventDate = (index: number) => {
    const updatedEventItems = [...eventItems];
    updatedEventItems[index] = {
      ...updatedEventItems[index],
      start_date: undefined,
      end_date: undefined,
    };
    setEventItems(updatedEventItems);
  };

  return (
    <form className="row" onSubmit={handleSubmit}>
      {/* set calendar year for insert */}
      {formType === "insert" && (
        <div className="col-12 mb-6">
          <Label>Year</Label>
          <Input
            type="number"
            value={calendarData.year}
            onChange={(e) => {
              setCalendarData((prev) => ({
                ...prev,
                year: Number(e.target.value),
              }));
            }}
            placeholder="Year"
            required
          />
        </div>
      )}

      {/* holiday */}
      <div className="col-12 mb-6">
        <h5 className="mb-4">Holiday</h5>
        {holidayItems.map((holiday, index) => (
          <div
            key={index}
            className="border border-border relative mb-6 bg-light rounded-md p-3"
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
            <div className="row gx-3">
              <div className="lg:col-6 mb-4">
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
                  required
                />
              </div>
              <div className="lg:col-6">
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"input"}
                      className="w-full flex justify-between"
                    >
                      {holiday.start_date ? (
                        holiday.end_date ? (
                          <>
                            {dateFormat(holiday.start_date)} -{" "}
                            {dateFormat(holiday.end_date)}
                          </>
                        ) : (
                          dateFormat(holiday.start_date)
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <span className="flex items-center">
                        {holiday.start_date && (
                          <span className="p-2">
                            <X
                              className="cursor-pointer border-box ml-auto h-4 w-4 opacity-50"
                              onClick={() => handleRemoveHolidayDate(index)}
                            />
                          </span>
                        )}
                        <span className="bg-border mb-2 mt-2 h-5 block w-[1px]"></span>
                        <span className="pl-2 block">
                          <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                        </span>
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      numberOfMonths={2}
                      selected={{
                        from: holiday.start_date
                          ? new Date(holiday.start_date)
                          : undefined,
                        to: holiday.end_date
                          ? new Date(holiday.end_date)
                          : undefined,
                      }}
                      onSelect={(range) => {
                        if (range) {
                          handleHolidayDateRangeChange(index, range);
                        }
                      }}
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
            className="border border-border relative mb-6 bg-light rounded-md p-3"
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
            <div className="row gx-3">
              <div className="lg:col-6 mb-4">
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
                  required
                />
              </div>
              <div className="lg:col-6">
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"input"}
                      className="w-full flex justify-between"
                    >
                      {event.start_date ? (
                        event.end_date ? (
                          <>
                            {dateFormat(new Date(event.start_date))} -{" "}
                            {dateFormat(new Date(event.end_date))}
                          </>
                        ) : (
                          dateFormat(new Date(event.start_date))
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <span className="flex items-center">
                        {event.start_date && (
                          <span className="p-2">
                            <X
                              className="cursor-pointer border-box ml-auto h-4 w-4 opacity-50"
                              onClick={() => handleRemoveEventDate(index)}
                            />
                          </span>
                        )}
                        <span className="bg-border mb-2 mt-2 h-5 block w-[1px]"></span>
                        <span className="pl-2 block">
                          <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                        </span>
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      numberOfMonths={2}
                      selected={{
                        from: event.start_date
                          ? new Date(event.start_date)
                          : undefined,
                        to: event.end_date
                          ? new Date(event.end_date)
                          : undefined,
                      }}
                      onSelect={(range) => {
                        if (range) {
                          handleEventDateRangeChange(index, range);
                        }
                      }}
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

      {/* for insert */}
      {formType === "insert" && (
        <div className="col-12 text-right">
          <Button disabled={loader}>
            {loader ? (
              <>
                Please wait
                <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
              </>
            ) : (
              "Insert Calendar"
            )}
          </Button>
        </div>
      )}

      {/* for update */}
      {formType === "update" && (
        <div className="col-12 text-right">
          <Button type="submit" disabled={loader}>
            {loader ? (
              <>
                Please wait
                <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
              </>
            ) : (
              "Update Calendar"
            )}
          </Button>
        </div>
      )}
    </form>
  );
};

export default CalendarForm;
