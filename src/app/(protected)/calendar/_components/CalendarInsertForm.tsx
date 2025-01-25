import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TCalendar,
  TEvent,
} from "@/redux/features/calendarApiSlice/calendarType";
import { Loader2, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const CalendarInsertForm = ({
  calendarData,
  setCalendarData,
  handleSubmit,
  loader,
}: {
  calendarData: Partial<TCalendar>;
  setCalendarData: Dispatch<SetStateAction<TCalendar>>;
  handleSubmit: (e: any) => Promise<void>;
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
    <>
      <form className="row" onSubmit={handleSubmit}>
        <div className="col-12 mb-4">
          <Label>Year</Label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            placeholder="Enter calendar year"
          />
        </div>

        <div className="col-12 mb-6">
          <h5 className="mb-4">Holiday</h5>
          {holidayItems.map((holiday, index) => (
            <div key={index} className="border mb-6 bg-light rounded-md p-3">
              <div className="row">
                <div className="col-12 mb-4">
                  <Label className="flex justify-between items-center">
                    Reason
                    <Button
                      type="button"
                      onClick={() => handleDeleteHoliday(index)}
                      size={"xs"}
                      variant="outline"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </Label>
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
                    <div className="w-1/2">
                      <Label>Start date</Label>
                      <Input
                        type="date"
                        value={holiday.start_date.toISOString().split("T")[0]}
                        onChange={(e) => {
                          const updatedHolidayItems = [...holidayItems];

                          updatedHolidayItems[index] = {
                            ...holiday,
                            start_date: new Date(e.target.value),
                          };
                          setHolidayItems(updatedHolidayItems);
                        }}
                        placeholder="Holiday Start"
                      />
                    </div>
                    <div className="w-1/2">
                      <Label>End date</Label>
                      <Input
                        type="date"
                        value={holiday.end_date.toISOString().split("T")[0]} // Convert Date to string in YYYY-MM-DD format
                        onChange={(e) => {
                          const updatedHolidayItems = [...holidayItems];

                          updatedHolidayItems[index] = {
                            ...holiday,
                            end_date: new Date(e.target.value), // Convert string back to Date object
                          };
                          setHolidayItems(updatedHolidayItems);
                        }}
                        placeholder="Holiday End"
                      />
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
            <div key={index} className="border mb-6 bg-light rounded-md p-3">
              <div className="row">
                <div className="col-12 mb-4">
                  <Label className="flex justify-between items-center">
                    Reason
                    <Button
                      type="button"
                      onClick={() => handleDeleteEvent(index)}
                      size={"xs"}
                      variant="outline"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </Label>
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
                    <div className="w-1/2">
                      <Label>Start date</Label>
                      <Input
                        type="date"
                        value={event.start_date.toISOString().split("T")[0]}
                        onChange={(e) => {
                          const updatedEventItems = [...eventItems];

                          updatedEventItems[index] = {
                            ...event,
                            start_date: new Date(e.target.value),
                          };
                          setEventItems(updatedEventItems);
                        }}
                        placeholder="Event Start"
                      />
                    </div>
                    <div className="w-1/2">
                      <Label>End date</Label>
                      <Input
                        type="date"
                        value={event.end_date.toISOString().split("T")[0]}
                        onChange={(e) => {
                          const updatedEventItems = [...eventItems];

                          updatedEventItems[index] = {
                            ...event,
                            end_date: new Date(e.target.value),
                          };
                          setEventItems(updatedEventItems);
                        }}
                        placeholder="Event End"
                      />
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
              "Add Calendar"
            )}
          </Button>
        </div>
      </form>

      {/* <form className="row" onSubmit={handleSubmit}>
        <h5>Event</h5>
        <div className="col-12 mb-4">
          <Label>Year</Label>
          <Input type="number" placeholder="Enter calendar year" />
        </div>
        <div className="col-12 mb-4">
          <Label>Reason</Label>
          <Input type="date" placeholder="Enter calendar year" />
        </div>

        <div className="col-12 text-right">
          <Button type="submit" className="self-end" disabled={loader}>
            {loader ? (
              <>
                Please wait
                <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
              </>
            ) : (
              "Add Now"
            )}
          </Button>
        </div>
      </form> */}
    </>
  );
};

export default CalendarInsertForm;
