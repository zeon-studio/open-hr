import options from "@/config/options.json";
import { dateFormat, formatDateWithTime } from "@/lib/date-converter";
import { cn } from "@/lib/shadcn";
import EditForm from "@/partials/edit-from";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Input } from "@/ui/input";
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
import { CalendarIcon } from "lucide-react";

interface PersonalFormProps {
  data: TEmployee;
  isUpdating: boolean;
  userRole: string;
  communication_platform: string;
  onSubmit: (data: TEmployee) => void;
}

export default function PersonalForm({
  data,
  isUpdating,
  userRole,
  communication_platform,
  onSubmit,
}: PersonalFormProps) {
  return (
    <EditForm<TEmployee>
      isUpdating={isUpdating}
      data={data}
      title="Personal Details"
      hasEditAccess={userRole !== "former"}
    >
      {({ handleChange, isReadOnly, data, formRef }) => (
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(data);
          }}
          className="row gap-y-4"
        >
          <div className="lg:col-6">
            <Label>Full Name:</Label>
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleChange({
                  ...data,
                  [name]: value,
                });
              }}
              type="text"
              value={data.name || ""}
              name="name"
              placeholder="Full Name"
              readOnly={isReadOnly}
            />
          </div>

          <div className="lg:col-6">
            <Label>Mobile Phone:</Label>
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleChange({
                  ...data,
                  [name]: value,
                });
              }}
              type="text"
              value={data.phone || ""}
              name="phone"
              placeholder="Phone Number"
              readOnly={isReadOnly}
            />
          </div>
          <div className="lg:col-6">
            <Label>Work Email:</Label>
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleChange({
                  ...data,
                  [name]: value,
                });
              }}
              type="email"
              value={data.work_email || ""}
              name="work_email"
              placeholder="Work Email"
              readOnly={isReadOnly}
            />
          </div>
          <div className="lg:col-6">
            <Label>Personal Email:</Label>
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleChange({
                  ...data,
                  [name]: value,
                });
              }}
              type="email"
              value={data.personal_email || ""}
              name="personal_email"
              placeholder="Personal Email"
              readOnly={isReadOnly}
            />
          </div>

          <div className="lg:col-6">
            <Label>Date of Birth:</Label>
            {isReadOnly ? (
              <p className="text-sm">
                {data.dob ? dateFormat(data.dob) : "Not Available"}
              </p>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"input"}
                    className={cn(
                      "w-full flex justify-between",
                      isReadOnly && "disabled:pl-0 disabled:border-none"
                    )}
                    disabled={isReadOnly}
                  >
                    {data.dob ? dateFormat(data.dob) : <span>Select Date</span>}
                    <span className="flex items-center">
                      <span
                        className={cn(
                          "bg-light mb-2 mt-2 h-5 block w-[1px]",
                          isReadOnly && "hidden"
                        )}
                      ></span>
                      <span
                        className={cn("pl-2  block", isReadOnly && "hidden")}
                      >
                        <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                      </span>
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data.dob ? new Date(data.dob) : new Date()}
                    onSelect={(date) =>
                      handleChange({
                        ...data,
                        dob: formatDateWithTime(date!),
                      })
                    }
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div className="lg:col-6">
            <Label>Gender:</Label>
            {isReadOnly ? (
              <p className="text-sm capitalize">
                {data.gender || "Not Available"}
              </p>
            ) : (
              <Select
                name="gender"
                value={data.gender}
                onValueChange={(value) =>
                  handleChange({
                    ...data,
                    gender: value as TEmployee["gender"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  {options.employee_gender.map((item) => {
                    return (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="lg:col-6">
            <Label>Present Address:</Label>
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleChange({
                  ...data,
                  [name]: value,
                });
              }}
              type="text"
              value={data.present_address || ""}
              name="present_address"
              placeholder="Present Address"
              readOnly={isReadOnly}
            />
          </div>

          <div className="lg:col-6">
            <Label>Permanent Address:</Label>
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleChange({
                  ...data,
                  [name]: value,
                });
              }}
              type="text"
              value={data.permanent_address || ""}
              name="permanent_address"
              placeholder="Permanent Address"
              readOnly={isReadOnly}
            />
          </div>

          <div className="lg:col-6">
            <Label>Blood Group:</Label>
            {isReadOnly ? (
              <p className="text-sm uppercase">
                {data.blood_group || "Not Available"}
              </p>
            ) : (
              <Select
                onValueChange={(value) =>
                  handleChange({
                    ...data,
                    blood_group: value as
                      | "a+"
                      | "a-"
                      | "b+"
                      | "b-"
                      | "o+"
                      | "o-"
                      | "ab+"
                      | "ab-",
                  })
                }
                name="blood_group"
                value={data.blood_group}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Blood" />
                </SelectTrigger>
                <SelectContent>
                  {options.employee_blood_group.map((employee_blood_group) => {
                    return (
                      <SelectItem
                        key={employee_blood_group.value}
                        value={employee_blood_group.value}
                      >
                        {employee_blood_group.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="lg:col-6">
            <Label>Marital Status:</Label>
            {isReadOnly ? (
              <p className="text-sm capitalize">
                {data.marital_status || "Not Available"}
              </p>
            ) : (
              <Select
                onValueChange={(value) =>
                  handleChange({
                    ...data,
                    marital_status: value as
                      | "married"
                      | "unmarried"
                      | "divorced"
                      | "widowed",
                  })
                }
                name="marital_status"
                value={data.marital_status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Marital Status" />
                </SelectTrigger>
                <SelectContent>
                  {options.employee_marital_status.map((item) => {
                    return (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="lg:col-6">
            <Label>Tin:</Label>
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleChange({
                  ...data,
                  [name]: value,
                });
              }}
              type="text"
              value={data.tin || ""}
              name="tin"
              placeholder="Tin"
              readOnly={isReadOnly}
            />
          </div>
          <div className="lg:col-6">
            <Label>NID:</Label>
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleChange({
                  ...data,
                  [name]: value,
                });
              }}
              type="text"
              value={data.nid || ""}
              name="nid"
              placeholder="NID"
              readOnly={isReadOnly}
            />
          </div>

          {!isReadOnly && (
            <>
              <div className="lg:col-6">
                <Label>Facebook Profile:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="url"
                  value={data.facebook || ""}
                  name="facebook"
                  placeholder="Facebook Profile"
                  readOnly={isReadOnly}
                />
              </div>

              <div className="lg:col-6">
                <Label>Twitter(X) Profile:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="url"
                  value={data.twitter || ""}
                  name="twitter"
                  placeholder="X profile"
                  readOnly={isReadOnly}
                />
              </div>

              <div className="lg:col-6">
                <Label>Linkedin Profile:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="url"
                  value={data.linkedin || ""}
                  name="linkedin"
                  placeholder="Linkedin Profile"
                  readOnly={isReadOnly}
                />
              </div>

              <div className="lg:col-6">
                <Label>{communication_platform} User ID:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.communication_id || ""}
                  name="communication_id"
                  placeholder={`${communication_platform} Username`}
                  readOnly={isReadOnly}
                />
              </div>
            </>
          )}

          <div className="lg:col-6">
            <Label>Personality:</Label>
            <Input
              onChange={(e) => {
                const { name, value } = e.target;
                handleChange({
                  ...data,
                  [name]: value,
                });
              }}
              type="text"
              value={data.personality || ""}
              name="personality"
              placeholder="Personality Type"
              readOnly={isReadOnly}
            />
          </div>
          {(userRole === "admin" || userRole === "moderator") && (
            <>
              <div className="lg:col-6">
                <Label>Status:</Label>
                {isReadOnly ? (
                  <p className="text-sm capitalize">
                    {data.status || "Not Available"}
                  </p>
                ) : (
                  <Select
                    onValueChange={(value) => {
                      handleChange({
                        ...data,
                        status: value as TEmployee["status"],
                      });
                    }}
                    name="status"
                    value={data.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.employee_status.map((item) => {
                        return (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="lg:col-12">
                <Label>Note:</Label>
                <Textarea
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  value={data.note || ""}
                  name="note"
                  rows={5}
                  readOnly={isReadOnly}
                />
              </div>
            </>
          )}
        </form>
      )}
    </EditForm>
  );
}
