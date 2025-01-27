import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDialog } from "@/hooks/useDialog";
import { useUpdateCalendarMutation } from "@/redux/features/calendarApiSlice/calendarSlice";
import { TCalendar } from "@/redux/features/calendarApiSlice/calendarType";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CalendarForm from "./CalendarForm";

const CalendarUpdate = ({ calendarData }: { calendarData: TCalendar[] }) => {
  const [year, setYear] = useState(new Date().getFullYear());

  const { isDialogOpen, onDialogChange } = useDialog();
  const [loader, setLoader] = useState(false);

  const [updatedCalendarData, setUpdatedCalendarData] = useState<TCalendar>(
    () => {
      return (
        calendarData?.find((cal) => cal.year === year) ?? {
          year: year,
          holidays: [],
          events: [],
          createdAt: new Date(),
        }
      );
    }
  );

  useEffect(() => {
    const yearData = calendarData?.find((cal) => cal.year === year);
    if (yearData) {
      setUpdatedCalendarData(yearData);
    }
  }, [year, calendarData]);

  const [updateCalendar, { isSuccess, isError, error }] =
    useUpdateCalendarMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      await updateCalendar(updatedCalendarData);
    } catch (error) {
      console.error(error);
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
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <Dialog modal={true} open={isDialogOpen} onOpenChange={onDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="max-sm:w-full">
          Update Calendar
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl overflow-y-auto h-[90vh]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="mb-4">
          <Label>Update Calendar for </Label>
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
              {calendarData?.map((cal) => (
                <SelectItem key={cal.year} value={cal.year.toString()}>
                  {cal.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DialogTitle>

        <CalendarForm
          calendarData={updatedCalendarData}
          setCalendarData={setUpdatedCalendarData}
          handleSubmit={handleSubmit}
          buttonText="Update Calendar"
          loader={loader}
          mode="update"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CalendarUpdate;
