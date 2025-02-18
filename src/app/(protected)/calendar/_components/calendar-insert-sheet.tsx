import { useDialog } from "@/hooks/useDialog";
import {
  readSheetData,
  transformCalSheetData,
} from "@/lib/sheet-data-converter";
import { useAddCalendarMutation } from "@/redux/features/calendarApiSlice/calendarSlice";
import { TCalSheet } from "@/redux/features/calendarApiSlice/calendarType";
import { Button, buttonVariants } from "@/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { FileDown, FileUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CalendarInsertSheet = () => {
  const { isDialogOpen, onDialogChange } = useDialog();
  const [loader, setLoader] = useState(false);

  const [sheetData, setSheetData] = useState<TCalSheet>({
    year: new Date().getFullYear(),
    events: [],
  });

  const [addCalendar, { isSuccess, isError, error }] = useAddCalendarMutation();

  const handleSubmit = async (e: any) => {
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
      setSheetData({ year: new Date().getFullYear(), events: [] });
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
    <Dialog modal={true} open={isDialogOpen} onOpenChange={onDialogChange}>
      <DialogTrigger asChild>
        <Button
          className="rounded-l-none border-l border-border"
          title="Upload Calendar Sheet"
        >
          <FileUp size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
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
            <Label>Select Sheet Data (csv or xlsx)</Label>
            <Input
              type="file"
              accept=".csv, .xlsx"
              className="!border-solid !px-3 cursor-pointer !py-2"
              onChange={async (e) => {
                const target = e.target as HTMLInputElement;
                if (target.files) {
                  try {
                    const data = await readSheetData(target.files[0]);

                    setSheetData((prev: any) => ({
                      ...prev,
                      events: data,
                    }));
                  } catch (error) {
                    console.log(error);
                  }
                }
              }}
            />
          </div>

          <div className="col-12">
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
              <Link
                className={buttonVariants({
                  variant: "outline",
                  className: "max-sm:w-full",
                })}
                href="/sample-calendar.xlsx"
              >
                Download Sample File <FileDown className="ml-2" size={16} />
              </Link>
              <Button
                type="submit"
                className="self-end max-sm:w-full"
                disabled={loader}
              >
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarInsertSheet;
