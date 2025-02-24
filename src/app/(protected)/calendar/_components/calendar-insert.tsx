import { useAddCalendarMutation } from "@/redux/features/calendarApiSlice/calendarSlice";
import { TCalendar } from "@/redux/features/calendarApiSlice/calendarType";
import { DialogContent, DialogTitle } from "@/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CalendarForm from "./calendar-form";

const CalendarInsert = ({
  onDialogChange,
}: {
  onDialogChange: (open: boolean) => void;
}) => {
  const [loader, setLoader] = useState(false);
  const [calendarData, setCalendarData] = useState<TCalendar>({
    year: new Date().getFullYear(),
    holidays: [
      {
        start_date: undefined,
        end_date: undefined,
        day_count: 0,
        reason: "",
      },
    ],
    events: [
      {
        start_date: undefined,
        end_date: undefined,
        day_count: 0,
        reason: "",
      },
    ],
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
      toast("Something went wrong");
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <DialogContent
      className="!max-w-4xl overflow-y-auto max-h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Add New Year Calendar</DialogTitle>

      <CalendarForm
        calendarData={calendarData}
        setCalendarData={setCalendarData}
        handleSubmit={handleSubmit}
        loader={loader}
        formType="insert"
      />
    </DialogContent>
  );
};

export default CalendarInsert;
