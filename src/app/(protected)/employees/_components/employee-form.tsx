import ConfirmationPopup from "@/components/ConfirmationPopup";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
import { useDeleteEmployeeMutation } from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const EmployeeForm = ({
  handleSubmit,
  employeeData,
  setEmployeeData,
  formType,
  loader,
}: {
  handleSubmit: (e: any) => Promise<void>;
  employeeData: Partial<TEmployee>;
  setEmployeeData: Dispatch<SetStateAction<Partial<TEmployee>>>;
  formType: string;
  loader: boolean;
}) => {
  const [deleteProduct] = useDeleteEmployeeMutation();

  // product delete
  const handleProductDelete = async () => {
    if (employeeData.id) {
      try {
        await deleteProduct({ id: employeeData.id });
      } catch (error: any) {
        console.log(error.message);
      }
    }
  };

  return (
    <form className="row" onSubmit={handleSubmit}>
      <div className="col-12 mb-4">
        <Label>name</Label>
        <Input
          type="text"
          value={employeeData.name || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="name"
        />
      </div>
      <div className="col-12 mb-4">
        <Label>work email</Label>
        <Input
          type="email"
          value={employeeData.work_email || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({ ...prev, work_email: e.target.value }))
          }
          placeholder="work_email"
        />
      </div>
      <div className="col-12 mb-4">
        <Label>personal email</Label>
        <Input
          type="email"
          value={employeeData.personal_email || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({
              ...prev,
              personal_email: e.target.value,
            }))
          }
          placeholder="personal_email"
        />
      </div>
      <div className="col-12 mb-4">
        <Label>tin</Label>
        <Input
          type="text"
          value={employeeData.tin || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({ ...prev, tin: e.target.value }))
          }
          placeholder="tin"
        />
      </div>
      <div className="col-12 mb-4">
        <Label>nid</Label>
        <Input
          type="text"
          value={employeeData.nid || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({ ...prev, nid: e.target.value }))
          }
          placeholder="nid"
        />
      </div>
      <div className="col-12 mb-4">
        <Label>phone</Label>
        <Input
          type="text"
          value={employeeData.phone || ""}
          onChange={(e) =>
            setEmployeeData((prev) => ({ ...prev, phone: e.target.value }))
          }
          placeholder="phone"
        />
      </div>
      <div className="lg:col-6 mb-4">
        <Label>gender</Label>
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
      <div className="lg:col-6 mb-4">
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
      <div className="lg:col-6 mb-4">
        <div className="flex border rounded p-4 justify-between items-center space-x-2">
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
      <div className="lg:col-6 mb-4">
        <div className="flex border rounded p-4 justify-between items-center space-x-2">
          <Label>Date of Birth</Label>
          <Input
            type="date"
            value={
              employeeData.dob
                ? new Date(employeeData.dob).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setEmployeeData({
                ...employeeData,
                dob: new Date(e.target.value),
              })
            }
            placeholder="dob"
          />
        </div>
      </div>
      <div className="lg:col-6 mb-4">
        <div className="flex border rounded p-4 justify-between items-center space-x-2">
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
            placeholder="present_address"
          />
        </div>
      </div>
      <div className="lg:col-6 mb-4">
        <div className="flex border rounded p-4 justify-between items-center space-x-2">
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
            placeholder="permanent_address"
          />
        </div>
      </div>

      <div className="lg:col-6 mb-4">
        <div className="flex border rounded p-4 justify-between items-center space-x-2">
          <Label>Facebook</Label>
          <Input
            type="text"
            value={employeeData.facebook || ""}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, facebook: e.target.value })
            }
            placeholder="facebook"
          />
        </div>
      </div>

      <div className="lg:col-6 mb-4">
        <div className="flex border rounded p-4 justify-between items-center space-x-2">
          <Label>twitter</Label>
          <Input
            type="text"
            value={employeeData.twitter || ""}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, twitter: e.target.value })
            }
            placeholder="twitter"
          />
        </div>
      </div>

      <div className="lg:col-6 mb-4">
        <div className="flex border rounded p-4 justify-between items-center space-x-2">
          <Label>Linkedin</Label>
          <Input
            type="text"
            value={employeeData.linkedin || ""}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, linkedin: e.target.value })
            }
            placeholder="linkedin"
          />
        </div>
      </div>

      <div className="lg:col-6 mb-4">
        <div className="flex border rounded p-4 justify-between items-center space-x-2">
          <Label>Discord</Label>
          <Input
            type="text"
            value={employeeData.discord || ""}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, discord: e.target.value })
            }
            placeholder="discord"
          />
        </div>
      </div>

      <div className="lg:col-6 mb-4">
        <div className="flex border rounded p-4 justify-between items-center space-x-2">
          <Label>Personality Type</Label>
          <Input
            type="text"
            value={employeeData.personality || ""}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, personality: e.target.value })
            }
            placeholder="personality"
          />
        </div>
      </div>

      <div className="lg:col-6 mb-4">
        <div className="flex border rounded p-4 justify-between items-center space-x-2">
          <Label>Note</Label>
          <Input
            type="text"
            value={employeeData.note || ""}
            onChange={(e) =>
              setEmployeeData({ ...employeeData, note: e.target.value })
            }
            placeholder="note"
          />
        </div>
      </div>

      <div className="lg:col-6 mb-4">
        <div className="flex border rounded p-4 justify-between items-center space-x-2">
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
      <div className="lg:col-6 mb-4">
        <div className="flex border rounded p-4 justify-between items-center space-x-2">
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
      )}

      {/* for Update */}
      {formType === "update" && (
        <div className="col-12 text-right">
          <Dialog>
            <DialogTrigger className="mr-2" asChild>
              <Button variant="destructive">Delete Product</Button>
            </DialogTrigger>
            <ConfirmationPopup
              handleConfirmation={handleProductDelete}
              id={employeeData.id!}
              description="Delete Product will permanently delete all included file from the Bucket."
            />
          </Dialog>
          <Button className="self-end" disabled={loader}>
            {loader ? (
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
