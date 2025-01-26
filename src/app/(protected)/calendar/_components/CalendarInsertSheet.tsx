import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDialog } from "@/hooks/useDialog";
import { readCalSheet } from "@/lib/calendarDataFormat";
import { useAddCalendarMutation } from "@/redux/features/calendarApiSlice/calendarSlice";
import {
  TCalendar,
  TCalSheet,
} from "@/redux/features/calendarApiSlice/calendarType";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CalendarInsertSheet = () => {
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
        <Button className="max-sm:w-full">Add Calendar Sheet</Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl overflow-y-auto h-[90vh]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="mb-4">Add New Year Calendar Sheet</DialogTitle>
        <form className="row" onSubmit={handleSubmit}>
          <div className="col-12 mb-4">
            <Label>Calendar Year</Label>
            <Input
              type="number"
              value={sheetData?.year}
              onChange={(e) =>
                setSheetData((prev) => ({
                  ...prev,
                  year: Number(e.target.value),
                }))
              }
              placeholder="Enter calendar year"
            />
          </div>
          <div className="col-12 mb-4">
            <Label>Update Sheet Data (csv or xlsx)</Label>
            <Input
              type="file"
              accept=".csv, .xlsx"
              className="!border-solid"
              onChange={async (e) => {
                const target = e.target as HTMLInputElement;
                if (target.files) {
                  try {
                    const data = await readCalSheet(target.files[0]);

                    setSheetData((prev: any) => ({
                      ...prev,
                      events: data,
                    }));
                  } catch (error) {
                    console.error("Error reading file:", error);
                  }
                }
              }}
            />
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
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarInsertSheet;
