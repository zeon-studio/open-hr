import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const CalendarInsertForm = ({
  handleSubmit,
  loader,
}: {
  handleSubmit: (e: any) => Promise<void>;
  loader: boolean;
}) => {
  const [calendar, setCalendar] = useState({
    year: "",
    holidays: [
      {
        start_date: Date,
        end_date: Date,
        reason: "",
      },
    ],
    events: [
      {
        start_date: Date,
        end_date: Date,
        reason: "",
      },
    ],
  });

  // holidays
  const addHoliday = () => {
    setCalendar({
      ...calendar,
      holidays: [
        ...calendar.holidays,
        {
          start_date: Date,
          end_date: Date,
          reason: "",
        },
      ],
    });
  };

  const addEvent = () => {
    setCalendar({
      ...calendar,
      events: [
        ...calendar.events,
        {
          start_date: Date,
          end_date: Date,
          reason: "",
        },
      ],
    });
  };

  return (
    <>
      <form className="row" onSubmit={handleSubmit}>
        <div className="col-12 mb-4">
          <Label>Year</Label>
          <Input type="number" placeholder="Enter calendar year" />
        </div>
        <div className="col-12">
          <div className="flex justify-between">
            <h5>Holiday</h5>
            <Button
              type="button"
              className="self-end"
              onClick={addHoliday}
              disabled={loader}
            >
              Add Holiday
            </Button>
          </div>
        </div>
        {calendar.holidays.map((holiday, index) => (
          <div key={index} className="col-12 mb-4">
            <div className="w-full mb-2">
              <Label>Reason</Label>
              <Input
                type="text"
                value={holiday.reason}
                onChange={(e) => {
                  setCalendar({
                    ...calendar,
                    holidays: [
                      ...calendar.holidays,
                      { ...holiday, reason: e.target.value },
                    ],
                  });
                }}
                placeholder="Holiday Reason"
              />
            </div>
            <div className="w-full">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <Label>Start date</Label>
                  <Input type="date" placeholder="Holiday Start" />
                </div>
                <div className="w-1/2">
                  <Label>End date</Label>
                  <Input type="date" placeholder="Holiday End" />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="col-12 text-left">
          <Button type="submit" className="self-end" disabled={loader}>
            {loader ? (
              <>
                Please wait
                <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
              </>
            ) : (
              "Save"
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
