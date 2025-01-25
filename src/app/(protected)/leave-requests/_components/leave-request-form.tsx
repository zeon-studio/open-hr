import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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
import options from "@/config/options.json";
import { TLeaveRequest } from "@/redux/features/leaveRequestApiSlice/leaveRequestType";
import { CalendarIcon, Loader2 } from "lucide-react";
import { SetStateAction } from "react";

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
  return (
    <form className="row justify-between items-center" onSubmit={handleSubmit}>
      {/* type */}
      <div className="lg:col-6 mb-4">
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
      {/* start date */}
      <div className="lg:col-6 mb-4">
        <Label>Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full flex justify-between border-border/30 rounded"
            >
              {leaveRequestData.start_date ? (
                new Date(leaveRequestData.start_date).toDateString()
              ) : (
                <span>Pick a date</span>
              )}
              <span className="flex items-center">
                <span className="bg-[#cccccc] mb-2 mt-2 h-5 block w-[1px]"></span>
                <span className="pl-2  block">
                  <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                </span>
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                leaveRequestData.start_date
                  ? new Date(leaveRequestData.start_date)
                  : new Date()
              }
              onSelect={(e: any) =>
                setLeaveRequestData({
                  ...leaveRequestData,
                  start_date: e,
                })
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* end date */}
      <div className="lg:col-6 mb-4">
        <Label>End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full flex justify-between border-border/30 rounded"
            >
              {leaveRequestData.end_date ? (
                new Date(leaveRequestData.end_date).toDateString()
              ) : (
                <span>Pick a date</span>
              )}
              <span className="flex items-center">
                <span className="bg-[#cccccc] mb-2 mt-2 h-5 block w-[1px]"></span>
                <span className="pl-2  block">
                  <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                </span>
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                leaveRequestData.end_date
                  ? new Date(leaveRequestData.end_date)
                  : new Date()
              }
              onSelect={(e: any) =>
                setLeaveRequestData({
                  ...leaveRequestData,
                  end_date: e,
                })
              }
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* reason */}
      <div className="lg:col-12 mb-4">
        <Label>Reason</Label>
        <Input
          type="text"
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
