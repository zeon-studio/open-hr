import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDialog } from "@/hooks/useDialog";
import { useAddCalendarMutation } from "@/redux/features/calendarApiSlice/calendarSlice";
import { TCalendar } from "@/redux/features/calendarApiSlice/calendarType";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CalendarInsertForm from "./CalendarInsertForm";

const CalendarUpdate = () => {
  const { isDialogOpen, onDialogChange } = useDialog();
  const [loader, setLoader] = useState(false);
  const [calendarData, setCalendarData] = useState<TCalendar>({
    year: new Date().getFullYear(),
    holidays: [
      {
        start_date: new Date(),
        end_date: new Date(),
        reason: "",
      },
    ],
    events: [
      {
        start_date: new Date(),
        end_date: new Date(),
        reason: "",
      },
    ],
    createdAt: new Date(),
  });

  const [addCalendar, { isSuccess, isError, error }] = useAddCalendarMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      addCalendar(calendarData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      setCalendarData({
        year: new Date().getFullYear(),
        holidays: [],
        events: [],
        createdAt: new Date(),
      });
      // close modal/dialog
      onDialogChange(false);
      toast("Calendar added complete");
    } else if (isError) {
      setLoader(false);
      toast("something went wrong");
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

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
        <DialogTitle className="mb-4">Update Calendar</DialogTitle>

        <CalendarInsertForm
          calendarData={calendarData}
          setCalendarData={setCalendarData}
          handleSubmit={handleSubmit}
          loader={loader}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CalendarUpdate;
