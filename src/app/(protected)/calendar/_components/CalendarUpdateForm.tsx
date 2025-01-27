import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  TCalendar,
  TEvent,
} from "@/redux/features/calendarApiSlice/calendarType";
import { CalendarIcon, Loader2, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const CalendarUpdateForm = ({
  calendarData,
  setCalendarData,
  handleSubmit,
  buttonText,
  loader,
}: {
  calendarData: Partial<TCalendar>;
  setCalendarData: Dispatch<SetStateAction<TCalendar>>;
  handleSubmit: (e: any) => Promise<void>;
  buttonText: string;
  loader: boolean;
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

  useEffect(() => {
    if (
      calendarData?.year !== year ||
      JSON.stringify(calendarData?.holidays) !== JSON.stringify(holidayItems) ||
      JSON.stringify(calendarData?.events) !== JSON.stringify(eventItems)
    ) {
      setYear(calendarData?.year || new Date().getFullYear());
      setHolidayItems(calendarData?.holidays || []);
      setEventItems(calendarData?.events || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarData]);

  useEffect(() => {
    setCalendarData((prev) => ({
      ...prev,
      year: year,
      holidays: holidayItems.map((item) => ({
        start_date: item.start_date,
        end_date: item.end_date,
        reason: item.reason,
      })),
      events: eventItems.map((item) => ({
        start_date: item.start_date,
        end_date: item.end_date,
        reason: item.reason,
      })),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holidayItems, eventItems]);

  // holiday
  const handleAddHoliday = () => {
    setHolidayItems([
      ...holidayItems,
      {
        start_date: new Date(),
        end_date: new Date(),
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
        reason: "",
      },
    ]);
  };
  const handleDeleteEvent = async (index: number) => {
    setEventItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <form className="row" onSubmit={handleSubmit}>
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
                <div className="flex gap-4">
                  {/* start date */}
                  <div className="w-1/2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"input"}
                          className="w-full flex justify-between border-border/30 rounded"
                        >
                          {holiday.start_date ? (
                            new Date(holiday.start_date).toDateString()
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <span className="flex items-center ">
                            <span className="bg-border/30 mb-2 mt-2 h-5 block w-[1px]"></span>
                            <span className="pl-2 block">
                              <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                            </span>
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            holiday.start_date
                              ? new Date(holiday.start_date)
                              : new Date()
                          }
                          onSelect={(e) => {
                            const updatedHolidayItems = [...holidayItems];
                            updatedHolidayItems[index] = {
                              ...holiday,
                              start_date: new Date(e?.toString()!),
                            };
                            setHolidayItems(updatedHolidayItems);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* end date */}
                  <div className="w-1/2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"input"}
                          className="w-full flex justify-between border-border/30 rounded"
                        >
                          {holiday.end_date ? (
                            new Date(holiday.end_date).toDateString()
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <span className="flex items-center ">
                            <span className="bg-border/30 mb-2 mt-2 h-5 block w-[1px]"></span>
                            <span className="pl-2 block">
                              <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                            </span>
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            holiday.end_date
                              ? new Date(holiday.end_date)
                              : new Date()
                          }
                          onSelect={(e) => {
                            const updatedHolidayItems = [...holidayItems];
                            updatedHolidayItems[index] = {
                              ...holiday,
                              end_date: new Date(e?.toString()!),
                            };
                            setHolidayItems(updatedHolidayItems);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
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
                <div className="flex gap-4">
                  {/* start date */}
                  <div className="w-1/2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"input"}
                          className="w-full flex justify-between"
                        >
                          {event.start_date ? (
                            new Date(event.start_date).toDateString()
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <span className="flex items-center">
                            <span className="bg-border/30 mb-2 mt-2 h-5 block w-[1px]"></span>
                            <span className="pl-2 block">
                              <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                            </span>
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            event.start_date
                              ? new Date(event.start_date)
                              : new Date()
                          }
                          onSelect={(e) => {
                            const updatedEventItems = [...eventItems];
                            updatedEventItems[index] = {
                              ...event,
                              start_date: new Date(e?.toString()!),
                            };
                            setEventItems(updatedEventItems);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* end date */}
                  <div className="w-1/2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"input"}
                          className="w-full flex justify-between"
                        >
                          {event.end_date ? (
                            new Date(event.end_date).toDateString()
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <span className="flex items-center ">
                            <span className="bg-border/30 mb-2 mt-2 h-5 block w-[1px]"></span>
                            <span className="pl-2 block">
                              <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                            </span>
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            event.end_date
                              ? new Date(event.end_date)
                              : new Date()
                          }
                          onSelect={(e) => {
                            const updatedEventItems = [...eventItems];
                            updatedEventItems[index] = {
                              ...event,
                              end_date: new Date(e?.toString()!),
                            };
                            setEventItems(updatedEventItems);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
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

export default CalendarUpdateForm;
