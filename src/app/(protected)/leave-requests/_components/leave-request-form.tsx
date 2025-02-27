import options from "@/config/options.json";
import { dateFormat, formatDateWithTime } from "@/lib/date-converter";
import { useGetUpcomingLeaveDatesRequestsQuery } from "@/redux/features/leaveRequestApiSlice/leaveRequestSlice";
import { TLeaveRequest } from "@/redux/features/leaveRequestApiSlice/leaveRequestType";
import { useAppSelector } from "@/redux/hook";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Label } from "@/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Textarea } from "@/ui/textarea";
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
  const { max_leave_per_day, leave_threshold_days } = useAppSelector(
    (state) => state["setting-slice"]
  );

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  // Reset dateRange when leave_type changes
  useEffect(() => {
    setDateRange({ from: undefined, to: undefined });
  }, [leaveRequestData.leave_type]);

  useEffect(() => {
    setLeaveRequestData({
      ...leaveRequestData,
      start_date: dateRange?.from
        ? formatDateWithTime(dateRange.from)
        : undefined,
      end_date: dateRange?.to
        ? formatDateWithTime(dateRange.to)
        : dateRange?.from
          ? formatDateWithTime(dateRange?.from)
          : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  // add days to today
  const today = new Date();
  const addDays = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date;
  };

  // Get threshold days based on leave type
  const getThresholdDayCount = () => {
    if (!leaveRequestData.leave_type) return 0;
    return ["casual", "earned"].includes(leaveRequestData.leave_type)
      ? leave_threshold_days || 0
      : 0;
  };

  // Get max leave per day based on leave type
  const getMaxLeavePerDay = () => {
    if (!leaveRequestData.leave_type) return 0;
    return ["casual", "earned"].includes(leaveRequestData.leave_type)
      ? max_leave_per_day || 0
      : 0;
  };

  // Modify getThresholdDays to remove unused parameter
  const getThresholdDays = (): Date[] => {
    const thresholdDays = getThresholdDayCount();
    if (thresholdDays === 0) return [];
    const disabledDates: Date[] = [];
    for (let i = 0; i < thresholdDays; i++) {
      disabledDates.push(i === 0 ? today : addDays(i));
    }
    return disabledDates;
  };

  // Get duplicate dates from database
  const { data } = useGetUpcomingLeaveDatesRequestsQuery(
    today.toISOString().slice(0, 10)
  );

  // updated getDuplicateDates function with proper typing
  const getDuplicateDates = (): Date[] => {
    const duplicateNumber = getMaxLeavePerDay();
    const dates = data?.result as string[] | undefined;

    if (!dates) return [];
    if (duplicateNumber === 0) return [];
    if (duplicateNumber === 1) {
      return dates.map((date: string) => new Date(date));
    }
    return Array.from(
      new Set(
        dates
          .filter(
            (date: string) =>
              dates.filter((d: string) => d === date).length >= duplicateNumber
          )
          .map((date: string) => new Date(date))
      )
    );
  };

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
              <SelectItem value={item.value} key={item.value}>
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
                <span className="bg-border mb-2 mt-2 h-5 block w-[1px]"></span>
                <span className="pl-2  block">
                  <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                </span>
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              disabled={[...getThresholdDays(), ...getDuplicateDates()]}
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
            "Add Request"
          )}
        </Button>
      </div>
    </form>
  );
};

export default LeaveRequestForm;
