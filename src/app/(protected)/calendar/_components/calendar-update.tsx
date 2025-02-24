import { useDialog } from "@/hooks/useDialog";
import {
  useGetCalendarsQuery,
  useUpdateCalendarMutation,
} from "@/redux/features/calendarApiSlice/calendarSlice";
import { TCalendar } from "@/redux/features/calendarApiSlice/calendarType";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CalendarForm from "./calendar-form";

const CalendarUpdate = () => {
  // get calendar Data by year
  const { data } = useGetCalendarsQuery(undefined);
  const { result: calendars } = data || {};

  const [year, setYear] = useState(new Date().getFullYear());

  const { isDialogOpen, onDialogChange } = useDialog();
  const [loader, setLoader] = useState(false);

  const [updatedCalendarData, setUpdatedCalendarData] = useState<TCalendar>(
    () => {
      return (
        calendars?.find((cal) => cal.year === year) ?? {
          year: year,
          holidays: [],
          events: [],
          createdAt: new Date(),
        }
      );
    }
  );

  useEffect(() => {
    const yearData = calendars?.find((cal) => cal.year === year);
    if (yearData) {
      setUpdatedCalendarData(yearData);
    }
  }, [year, calendars]);

  const [updateCalendar, { isSuccess, isError, error }] =
    useUpdateCalendarMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      await updateCalendar(updatedCalendarData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      onDialogChange(false);
      setUpdatedCalendarData({
        year: new Date().getFullYear(),
        holidays: [],
        events: [],
        createdAt: new Date(),
      });
      onDialogChange(false);
      toast("Calendar update complete");
    } else if (isError) {
      setLoader(false);
      toast("Something went wrong");
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Dialog modal={true} open={isDialogOpen} onOpenChange={onDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="max-sm:w-full">
          Update Calendar Year
        </Button>
      </DialogTrigger>
      <DialogContent
        className="!max-w-4xl overflow-y-auto max-h-[90vh]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="mb-4">Update Calendar</DialogTitle>

        <div className="mb-6">
          <Label>Select Year</Label>
          <Select
            value={year.toString()}
            onValueChange={(value) => {
              setYear(parseInt(value, 10));
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {calendars?.map((cal) => (
                <SelectItem key={cal.year} value={cal.year.toString()}>
                  {cal.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CalendarForm
          key={updatedCalendarData.year}
          calendarData={updatedCalendarData}
          setCalendarData={setUpdatedCalendarData}
          handleSubmit={handleSubmit}
          loader={loader}
          formType="update"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CalendarUpdate;
