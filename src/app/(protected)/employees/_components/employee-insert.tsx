import options from "@/config/options.json";
import { dateFormat, formatDateWithTime } from "@/lib/date-converter";
import { employeeGroupByDepartment } from "@/lib/employee-info";
import { useAddEmployeeMutation } from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployeeCreate } from "@/redux/features/employeeApiSlice/employeeType";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { DialogContent, DialogTitle } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const initialEmployeeData = {
  personal_email: "",
  department: "" as any,
  job_type: "" as any,
  gross_salary: 0,
  joining_date: new Date(),
  designation: "",
  manager_id: "",
};

const EmployeeInsert = ({
  onDialogChange,
}: {
  onDialogChange: (open: boolean) => void;
}) => {
  const [loader, setLoader] = useState(false);
  const [employeeData, setEmployeeData] =
    useState<TEmployeeCreate>(initialEmployeeData);

  const [addEmployee, { isSuccess, isError, error }] = useAddEmployeeMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      // @ts-ignore
      addEmployee(employeeData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      setEmployeeData(initialEmployeeData);
      // close modal/dialog
      onDialogChange(false);
      toast("Employee added successfully");
    } else if (isError) {
      setLoader(false);
      toast("Something went wrong");
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <DialogContent
      className="!max-w-2xl overflow-y-auto max-h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Add New Employee</DialogTitle>
      <form onSubmit={handleSubmit} className="row">
        <div className="col-12 mb-4">
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

        <div className="col-12 mb-4">
          <Label>Department</Label>
          <Select
            required
            value={employeeData.department}
            onValueChange={(e: string) =>
              setEmployeeData((prev) => ({
                ...prev,
                department: e as
                  | "development"
                  | "design"
                  | "marketing"
                  | "admin"
                  | "hr_finance"
                  | "production"
                  | "other",
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

        <div className="col-12 mb-4">
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

        <div className="col-12 mb-4">
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

        <div className="col-12 mb-4">
          <Label>Gross Salary</Label>
          <Input
            type="number"
            required
            value={employeeData.gross_salary || 0}
            onChange={(e) =>
              setEmployeeData((prev) => ({
                ...prev,
                gross_salary: Number(e.target.value),
              }))
            }
            placeholder="Gross Salary"
          />
        </div>

        <div className="col-12 mb-4">
          <Label>Manager</Label>
          <Select
            required
            value={employeeData.manager_id}
            onValueChange={(value) =>
              setEmployeeData((prev) => ({
                ...prev,
                manager_id: value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select User" />
            </SelectTrigger>
            <SelectContent>
              {employeeGroupByDepartment().map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.options.map(
                    (option: { value: string; label: string }) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-12 mb-4">
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
                  <span className="bg-border mb-2 mt-2 h-5 block w-[1px]"></span>
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
                    joining_date: formatDateWithTime(date!),
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
    </DialogContent>
  );
};

export default EmployeeInsert;
