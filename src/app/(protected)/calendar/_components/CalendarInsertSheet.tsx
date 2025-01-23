import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { readCalSheet } from "@/lib/calendarDataFormat";
import { TCalSheet } from "@/redux/features/calendarApiSlice/calendarType";
import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const CalendarInsertSheet = ({
  handleSubmit,
  sheetData,
  setSheetData,
  loader,
}: {
  handleSubmit: (e: any) => Promise<void>;
  sheetData: Partial<TCalSheet>;
  setSheetData: Dispatch<SetStateAction<TCalSheet>>;
  loader: boolean;
}) => {
  return (
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
        <Label>Update Sheet Data</Label>
        <Input
          type="file"
          accept=".csv, .xlsx"
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
  );
};

export default CalendarInsertSheet;
