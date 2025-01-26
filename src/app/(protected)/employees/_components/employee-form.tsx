import ConfirmationPopup from "@/components/ConfirmationPopup";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
import {
  useAddEmployeeMutation,
  useDeleteEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";

const EmployeeForm = ({
  data,
  formType,
  onDialogChange,
}: {
  data: Partial<TEmployee>;
  formType: "insert" | "update";
  onDialogChange: (open: boolean) => void;
}) => {
  const [deleteProduct, { isLoading: isDeleteLoading }] =
    useDeleteEmployeeMutation();

  const [insertEmployee, { isLoading: isAddLoading }] =
    useAddEmployeeMutation();

  const [updateEmployee, { isLoading: isUpdateLoading }] =
    useUpdateEmployeeMutation();

  // product delete
  const handleProductDelete = async () => {
    if (employeeData.id) {
      try {
        await deleteProduct({ id: employeeData.id }).unwrap();
        onDialogChange(false);
      } catch (error: any) {
        console.log(error.message);
      }
    }
  };

  const handleUpdateEmployee = async () => {
    if (employeeData.id) {
      try {
        await updateEmployee(employeeData).unwrap();
        onDialogChange(false);
      } catch (error: any) {
        console.log(error.message);
      }
    }
  };

  const handleAddEmployee = async () => {
    try {
      await insertEmployee(employeeData).unwrap();
      onDialogChange(false);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const [employeeData, setEmployeeData] = useState<TEmployee>(
    data as TEmployee
  );

  return (
    <form
      className="grid grid-cols-1 gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (formType === "insert") {
          handleAddEmployee();
        } else if (formType === "update") {
          handleUpdateEmployee();
        }
      }}
    >
      <div>
        <Label>Name</Label>
        <Input
          type="text"
          value={employeeData.name || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Name"
        />
      </div>
      <div>
        <Label>Work email</Label>
        <Input
          type="email"
          value={employeeData.work_email || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({ ...prev, work_email: e.target.value }))
          }
          placeholder="Work email"
        />
      </div>
      <div>
        <Label>Personal Email</Label>
        <Input
          type="email"
          value={employeeData.personal_email || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({
              ...prev,
              personal_email: e.target.value,
            }))
          }
          placeholder="Personal email"
        />
      </div>
      <div>
        <Label>Tin</Label>
        <Input
          type="text"
          value={employeeData.tin || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({ ...prev, tin: e.target.value }))
          }
          placeholder="Tin"
        />
      </div>
      <div>
        <Label>Nid</Label>
        <Input
          type="text"
          value={employeeData.nid || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({ ...prev, nid: e.target.value }))
          }
          placeholder="Nid"
        />
      </div>
      <div>
        <Label>phone</Label>
        <Input
          type="text"
          value={employeeData.phone || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({ ...prev, phone: e.target.value }))
          }
          placeholder="Phone"
        />
      </div>
      <div>
        <Label>Gender</Label>
        <Select
          value={employeeData.gender}
          onValueChange={(e: "male" | "female") =>
            setEmployeeData({ ...employeeData, gender: e })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            {options.employee_gender.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Blood Group</Label>
        <Select
          value={employeeData.blood_group}
          onValueChange={(e) =>
            setEmployeeData({
              ...employeeData,
              blood_group: e as
                | "O+"
                | "O-"
                | "A+"
                | "A-"
                | "B+"
                | "B-"
                | "AB+"
                | "AB-",
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            {options.employee_blood_group.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <div>
          <Label>Marital Status</Label>
          <Select
            value={employeeData.marital_status}
            onValueChange={(e) =>
              setEmployeeData({
                ...employeeData,
                marital_status: e as
                  | "married"
                  | "unmarried"
                  | "divorced"
                  | "widowed",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {options.employee_marital_status.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <div>
          <Label>Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"input"} className="w-full flex justify-between">
                {employeeData.dob ? (
                  new Date(employeeData.dob).toDateString()
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
                  employeeData.dob ? new Date(employeeData.dob) : new Date()
                }
                onSelect={(e: any) =>
                  setEmployeeData({
                    ...employeeData,
                    dob: e,
                  })
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        <div>
          <Label>Present Address</Label>
          <Input
            type="text"
            value={employeeData.present_address || ""}
            onChange={(e) =>
              setEmployeeData({
                ...employeeData,
                present_address: e.target.value,
              })
            }
            placeholder="Present address"
          />
        </div>
      </div>
      <div>
        <div>
          <Label>Permanent Address</Label>
          <Input
            type="text"
            value={employeeData.permanent_address || ""}
            onChange={(e) =>
              setEmployeeData({
                ...employeeData,
                permanent_address: e.target.value,
              })
            }
            placeholder="Permanent address"
          />
        </div>
      </div>

      <div>
        <div>
          <Label>Facebook</Label>
          <Input
            type="text"
            value={employeeData.facebook || ""}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, facebook: e.target.value })
            }
            placeholder="Facebook"
          />
        </div>
      </div>

      <div>
        <div>
          <Label>Twitter</Label>
          <Input
            type="text"
            value={employeeData.twitter || ""}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, twitter: e.target.value })
            }
            placeholder="Twitter"
          />
        </div>
      </div>

      <div>
        <div>
          <Label>Linkedin</Label>
          <Input
            type="text"
            value={employeeData.linkedin || ""}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, linkedin: e.target.value })
            }
            placeholder="Linkedin"
          />
        </div>
      </div>

      <div>
        <div>
          <Label>Discord</Label>
          <Input
            type="text"
            value={employeeData.discord || ""}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, discord: e.target.value })
            }
            placeholder="Discord"
          />
        </div>
      </div>

      <div>
        <div>
          <Label>Personality Type</Label>
          <Input
            type="text"
            value={employeeData.personality || ""}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, personality: e.target.value })
            }
            placeholder="Personality"
          />
        </div>
      </div>

      <div>
        <div>
          <Label>Note</Label>
          <Input
            type="text"
            value={employeeData.note || ""}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, note: e.target.value })
            }
            placeholder="Note"
          />
        </div>
      </div>

      <div>
        <div>
          <Label>Status</Label>
          <Select
            value={employeeData.status}
            onValueChange={(e) =>
              setEmployeeData({
                ...employeeData,
                status: e as "pending" | "active" | "archived",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {options.employee_status.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <div>
          <Label>Role</Label>
          <Select
            value={employeeData.role}
            onValueChange={(e) =>
              setEmployeeData({
                ...employeeData,
                role: e as "user" | "moderator" | "admin",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {options.employee_role.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* for Insert */}
      {formType === "insert" && (
        <div>
          <Button className="self-end" disabled={isAddLoading}>
            {isAddLoading ? (
              <>
                Please wait
                <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
              </>
            ) : (
              "Add Now"
            )}
          </Button>
        </div>
      )}

      {/* for Update */}
      {formType === "update" && (
        <div className="text-end">
          <Dialog>
            <DialogTrigger className="mr-2" asChild>
              <Button disabled={isDeleteLoading} variant="destructive">
                {isDeleteLoading ? (
                  <>
                    Please wait
                    <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
                  </>
                ) : (
                  "Delete Employee"
                )}
              </Button>
            </DialogTrigger>
            <ConfirmationPopup
              handleConfirmation={handleProductDelete}
              id={employeeData.id!}
              description="Delete Product will permanently delete all included file from the Bucket."
            />
          </Dialog>
          <Button className="self-end" disabled={isUpdateLoading}>
            {isUpdateLoading ? (
              <>
                Please wait
                <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
              </>
            ) : (
              "Update Now"
            )}
          </Button>
        </div>
      )}
    </form>
  );
};

export default EmployeeForm;
