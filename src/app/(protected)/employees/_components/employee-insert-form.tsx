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
import { dateFormat } from "@/lib/date-converter";
import { useGetEmployeesBasicsQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployeeCreate } from "@/redux/features/employeeApiSlice/employeeType";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const EmployeeInsertForm = ({
  handleSubmit,
  employeeData,
  setEmployeeData,
  loader,
}: {
  handleSubmit: (e: any) => Promise<void>;
  employeeData: Partial<TEmployeeCreate>;
  setEmployeeData: Dispatch<SetStateAction<TEmployeeCreate>>;
  loader: boolean;
}) => {
  const { data } = useGetEmployeesBasicsQuery(undefined);
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label>Personal Email</Label>
        <Input
          required
          type="email"
          value={employeeData.personal_email || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({
              ...prev,
              personal_email: e.target.value || "",
            }))
          }
          placeholder="Personal Email"
        />
      </div>

      <div>
        <Label>Department</Label>
        <Select
          required
          value={employeeData.department}
          onValueChange={(e: string) =>
            setEmployeeData((prev) => ({
              ...prev,
              department: e as "admin" | "development" | "design" | "marketing",
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            {options.employee_department.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Job Type</Label>
        <Select
          required
          value={employeeData.job_type}
          onValueChange={(e: string) =>
            setEmployeeData((prev) => ({
              ...prev,
              job_type: e as
                | "full_time"
                | "part_time"
                | "remote"
                | "contractual"
                | "internship",
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Job Type" />
          </SelectTrigger>
          <SelectContent>
            {options.employee_job_type.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Designation</Label>
        <Input
          type="text"
          required
          value={employeeData.designation || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({
              ...prev,
              designation: e.target.value,
            }))
          }
          placeholder="Designation"
        />
      </div>

      <div>
        <Label>Manager</Label>
        <Select
          required
          value={employeeData.manager_id}
          onValueChange={(e) =>
            setEmployeeData((prev) => ({
              ...prev,
              manager_id: e,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Manager" />
          </SelectTrigger>
          <SelectContent>
            {data?.result.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Joining Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"input"} className="w-full flex justify-between">
              {employeeData.joining_date ? (
                dateFormat(employeeData.joining_date)
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
              required
              mode="single"
              selected={
                employeeData.joining_date
                  ? new Date(employeeData.joining_date)
                  : new Date()
              }
              onSelect={(date) => {
                setEmployeeData((prev) => ({
                  ...prev,
                  joining_date: date!,
                }));
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="col-12 text-right">
        <Button className="self-end" disabled={loader}>
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

export default EmployeeInsertForm;
