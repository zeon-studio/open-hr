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
import {
  AtSign,
  Briefcase,
  Cake,
  CalendarIcon,
  Droplet,
  Globe,
  HandHeart,
  Hash,
  Heart,
  Home,
  IdCard,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Receipt,
  Sparkles,
  User,
  UserRound,
  type LucideIcon
} from "lucide-react";
import type { ReactNode } from "react";

// Label decorated with a leading lucide icon for visual scanning.
function FieldLabel({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <Label className="flex items-center gap-1.5 mb-1.5">
      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <span>{children}</span>
    </Label>
  );
}

interface PersonalFormProps {
  data: TEmployee;
  isUpdating: boolean;
  userRole: string;
  communication_platform: string;
  onSubmit: (data: TEmployee) => void;
  popoverContainer?: HTMLElement | null;
}

// Read-only display for a field value. Empty values render as a muted
// "Not provided" instead of leaking the input placeholder.
function ReadOnlyValue({
  value,
  className,
}: {
  value?: string | number | null;
  className?: string;
}) {
  const isEmpty = value === null || value === undefined || value === "";
  return (
    <p className={cn("text-sm py-2", className)}>
      {isEmpty ? (
        <span className="text-muted-foreground italic">Not provided</span>
      ) : (
        value
      )}
    </p>
  );
}

export default function PersonalForm({
  data,
  isUpdating,
  userRole,
  communication_platform,
  onSubmit,
  popoverContainer,
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
          className="row gap-y-6"
        >
          <div className="lg:col-6">
            <FieldLabel icon={User}>Full Name</FieldLabel>
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
              className="pl-6!"
            />
          </div>

          <div className="lg:col-6">
            <FieldLabel icon={Phone}>Mobile Phone</FieldLabel>
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
              className="pl-6!"
            />
          </div>
          <div className="lg:col-6">
            <FieldLabel icon={Mail}>Work Email</FieldLabel>
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
              className="pl-6!"
            />
          </div>
          <div className="lg:col-6">
            <FieldLabel icon={AtSign}>Personal Email</FieldLabel>
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
              className="pl-6!"
            />
          </div>

          <div className="lg:col-6">
            <FieldLabel icon={Cake}>Date of Birth</FieldLabel>
            {isReadOnly ? (
              <ReadOnlyValue value={data.dob ? dateFormat(data.dob) : null} className="pl-6!" />
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"input"}
                    className={cn(
                      "w-full flex justify-between !pl-6",
                      isReadOnly && "disabled:pl-0 disabled:border-none"
                    )}
                    disabled={isReadOnly}
                  >
                    {data.dob ? dateFormat(data.dob) : <span>Select Date</span>}
                    <span className="flex items-center">
                      <span
                        className={cn(
                          "bg-light mb-2 mt-2 h-5 block w-px",
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
                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                  container={popoverContainer}
                >
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
            <FieldLabel icon={UserRound}>Gender</FieldLabel>
            {isReadOnly ? (
              <ReadOnlyValue value={data.gender} className="capitalize !pl-6" />
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
                <SelectTrigger className="pl-6!">
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
            <FieldLabel icon={MapPin}>Present Address</FieldLabel>
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
              className="pl-6!"
            />
          </div>

          <div className="lg:col-6">
            <FieldLabel icon={Home}>Permanent Address</FieldLabel>
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
              className="pl-6!"
            />
          </div>

          <div className="lg:col-6">
            <FieldLabel icon={Droplet}>Blood Group</FieldLabel>
            {isReadOnly ? (
              <ReadOnlyValue value={data.blood_group} className="uppercase !pl-6" />
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
                <SelectTrigger className="pl-6!">
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
            <FieldLabel icon={HandHeart}>Blood Donor</FieldLabel>
            {isReadOnly ? (
              <ReadOnlyValue value={data.blood_donor ? "Yes" : "No"} className="pl-6!" />
            ) : (
              <Select
                onValueChange={(value) =>
                  handleChange({
                    ...data,
                    blood_donor: value === "true",
                  })
                }
                name="blood_donor"
                value={data.blood_donor ? "true" : "false"}
              >
                <SelectTrigger className="pl-6!">
                  <SelectValue placeholder="Blood Donor" />
                </SelectTrigger>
                <SelectContent>
                  {options.employee_blood_donor.map((item) => {
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
            <FieldLabel icon={Heart}>Marital Status</FieldLabel>
            {isReadOnly ? (
              <ReadOnlyValue
                value={data.marital_status}
                className="capitalize !pl-6"
              />
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
                <SelectTrigger className="pl-6!">
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
            <FieldLabel icon={Receipt}>TIN</FieldLabel>
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
              className="pl-6!"
            />
          </div>
          <div className="lg:col-6">
            <FieldLabel icon={IdCard}>NID</FieldLabel>
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
              className="pl-6!"
            />
          </div>

          {!isReadOnly && (
            <>
              <div className="lg:col-6">
                <FieldLabel icon={Globe}>Facebook Profile</FieldLabel>
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
                  className="pl-6!"
                />
              </div>

              <div className="lg:col-6">
                <FieldLabel icon={Hash}>Twitter(X) Profile</FieldLabel>
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
                  className="pl-6!"
                />
              </div>

              <div className="lg:col-6">
                <FieldLabel icon={Briefcase}>Linkedin Profile</FieldLabel>
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
                  className="pl-6!"
                />
              </div>

              <div className="lg:col-6">
                <FieldLabel icon={MessageCircle}>
                  {communication_platform} User ID
                </FieldLabel>
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
                  className="pl-6!"
                />
              </div>
            </>
          )}

          <div className="lg:col-6">
            <FieldLabel icon={Sparkles}>Personality</FieldLabel>
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
              className="pl-6!"
            />
          </div>
          {(userRole === "admin" || userRole === "moderator") && (
            <div className="lg:col-12">
              <Label>Note</Label>
              {isReadOnly ? (
                <ReadOnlyValue
                  value={data.note}
                  className="whitespace-pre-wrap"
                />
              ) : (
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
                  className="pl-6!"
                />
              )}
            </div>
          )}
        </form>
      )}
    </EditForm>
  );
}
