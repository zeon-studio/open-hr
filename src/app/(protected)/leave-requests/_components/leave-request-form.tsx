import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import options from "@/config/options.json";
import { dateFormat } from "@/lib/dateFormat";
import { useGetUpcomingLeaveDatesRequestsQuery } from "@/redux/features/leaveRequestApiSlice/leaveRequestSlice";
import { TLeaveRequest } from "@/redux/features/leaveRequestApiSlice/leaveRequestType";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

const LeaveRequestForm = ({
  leaveRequestData,
  setLeaveRequestData,
  handleSubmit,
  loader,
}: {
  leaveRequestData: Partial<TLeaveRequest>;
  setLeaveRequestData: SetStateAction<any>;
  handleSubmit: (e: any) => Promise<void>;
  loader: boolean;
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    setLeaveRequestData({
      ...leaveRequestData,
      start_date: dateRange?.from
        ? format(dateRange.from, "yyyy-MM-dd")
        : undefined,
      end_date: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const today = new Date();
  const addDays = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date;
  };
  const { data } = useGetUpcomingLeaveDatesRequestsQuery(
    today.toISOString().slice(0, 10)
  );

  // get duplicate dates
  const getDuplicateDates = (arr: any): Date[] =>
    Array.from(
      new Set(
        arr
          .filter((item: any, i: number) => arr.indexOf(item) !== i)
          .map((dateString: string) => new Date(dateString))
      )
    );

  return (
    <form className="row justify-between items-center" onSubmit={handleSubmit}>
      {/* type */}
      <div className="col-12 mb-4">
        <Label>Type</Label>
        <Select
          value={leaveRequestData.leave_type}
          onValueChange={(value) =>
            setLeaveRequestData({ ...leaveRequestData, leave_type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            {options.leave_type.map((item) => (
              <SelectItem
                value={item.value}
                key={item.value}
                disabled={item.disabled}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* date range */}
      <div className="col-12 mb-4">
        <Label>Date Range</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"input"} className="w-full flex justify-between">
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {dateFormat(dateRange.from)} - {dateFormat(dateRange.to)}
                  </>
                ) : (
                  dateFormat(dateRange.from)
                )
              ) : (
                <span>Pick a date</span>
              )}
              <span className="flex items-center">
                <span className="bg-border/30 mb-2 mt-2 h-5 block w-[1px]"></span>
                <span className="pl-2  block">
                  <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                </span>
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              disabled={[
                today,
                addDays(1),
                addDays(2),
                ...getDuplicateDates(data?.result),
              ]}
              numberOfMonths={2}
              selected={dateRange}
              onSelect={setDateRange}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* reason */}
      <div className="lg:col-12 mb-4">
        <Label>Reason</Label>
        <Textarea
          className="h-20"
          value={leaveRequestData.reason}
          onChange={(e: any) =>
            setLeaveRequestData({ ...leaveRequestData, reason: e.target.value })
          }
        />
      </div>

      <div className="col-12 text-right">
        <Button disabled={loader}>
          {loader ? (
            <>
              Please wait
              <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
            </>
          ) : (
            "Add Platform"
          )}
        </Button>
      </div>
    </form>
  );
};

export default LeaveRequestForm;
