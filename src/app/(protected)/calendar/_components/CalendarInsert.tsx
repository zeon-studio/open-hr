import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { transformCalSheetData } from "@/lib/calendarDataFormat";
import { useAddCalendarMutation } from "@/redux/features/calendarApiSlice/calendarSlice";
import {
  TCalendar,
  TCalSheet,
} from "@/redux/features/calendarApiSlice/calendarType";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CalendarInsertForm from "./CalendarInsertForm";
import CalendarInsertSheet from "./CalendarInsertSheet";

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
  const [sheetData, setSheetData] = useState<TCalSheet>({
    year: new Date().getFullYear(),
    events: [],
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

  const handleSheetSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      const data = transformCalSheetData(sheetData);
      addCalendar(data);
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
  }, [isSuccess]);

  return (
    <DialogContent
      className="max-w-4xl overflow-y-auto h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Add New Year Calendar</DialogTitle>

      <CalendarInsertSheet
        handleSubmit={handleSheetSubmit}
        sheetData={sheetData}
        setSheetData={setSheetData}
        loader={loader}
      />

      <div className="flex justify-center items-center gap-6">
        <Separator className="w-2/5" />
        <p>OR</p>
        <Separator className="w-2/5" />
      </div>

      <CalendarInsertForm
        calendarData={calendarData}
        setCalendarData={setCalendarData}
        handleSubmit={handleSubmit}
        loader={loader}
      />
    </DialogContent>
  );
};

export default CalendarInsert;
