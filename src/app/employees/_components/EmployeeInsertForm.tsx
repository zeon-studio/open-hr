import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import options from "@/config/options.json";
import { useGetEmployeesIdQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployeeCreate } from "@/redux/features/employeeApiSlice/employeeType";
import { Loader2 } from "lucide-react";
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
  const { data } = useGetEmployeesIdQuery(undefined);

  return (
    <form className="row" onSubmit={handleSubmit}>
      <div className="col-12 mb-4">
        <Label>Personal Email</Label>
        <Input
          type="email"
          value={employeeData.personal_email || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({
              ...prev,
              personal_email: e.target.value || "",
            }))
          }
          placeholder="personal email"
        />
      </div>
      <div className="lg:col-6 mb-4">
        <Label>Department</Label>
        <Select
          value={employeeData.department}
          onValueChange={(e: string) =>
            setEmployeeData((prev) => ({
              ...prev,
              department: e as "admin" | "development" | "design" | "marketing",
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
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
      <div className="lg:col-6 mb-4">
        <Label>Job Type</Label>
        <Select
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
            <SelectValue placeholder="Select job_type" />
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

      <div className="lg:col-6 mb-4">
        <div className="flex border rounded p-4 justify-between items-center space-x-2">
          <Label>Designation</Label>
          <Input
            type="text"
            value={employeeData.designation || ""}
            onChange={(e) =>
              setEmployeeData((prev) => ({
                ...prev,
                designation: e.target.value,
              }))
            }
            placeholder="designation"
          />
        </div>
      </div>

      <div className="lg:col-6 mb-4">
        <div className="flex border rounded p-4 justify-between items-center space-x-2">
          <Label>Manager</Label>
          <Select
            value={employeeData.manager_id}
            onValueChange={(e) =>
              setEmployeeData((prev) => ({
                ...prev,
                manager_id: e,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
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
