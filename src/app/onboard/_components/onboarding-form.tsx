import options from "@/config/options.json";
import { dateFormat, formatDateWithTime } from "@/lib/date-converter";
import { cn } from "@/lib/shadcn";
import { useUpdateEmployeeMutation } from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { ErrorResponse } from "@/types";
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
import { DialogClose } from "@radix-ui/react-dialog";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { useStepper } from "./use-stepper";

export default function OnboardingForm({
  employeeId,
  defaultValue,
}: {
  employeeId: string;
  defaultValue: TEmployee;
}) {
  const params = useSearchParams();
  const token = params?.get("token") as string;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { handleStepChange } = useStepper();
  // @ts-ignore
  const [data, setData] = useState<TEmployee>(defaultValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setData({
      ...data,
      [name]: value,
    });
  };

  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await updateEmployee({
            ...data,
            id: employeeId,
            token,
            status: "active",
          }).unwrap();
          handleStepChange();
          buttonRef.current?.click();
        } catch (error) {
          toast.error(
            (error as ErrorResponse).data.message ?? "Something went wrong!"
          );
        }
      }}
      className="row gap-y-4 mt-10"
    >
      <div className="lg:col-6">
        <Label>Full Name:</Label>
        <Input
          onChange={handleChange}
          type="text"
          value={data.name || ""}
          name="name"
          placeholder="Full Name"
          required
        />
      </div>

      <div className="lg:col-6">
        <Label>Personal Email:</Label>
        <Input
          onChange={handleChange}
          type="email"
          value={data.personal_email || ""}
          name="personal_email"
          placeholder="Personal Email"
          required
        />
      </div>

      <div className="lg:col-6">
        <Label>Mobile Phone:</Label>
        <Input
          onChange={handleChange}
          type="text"
          value={data.phone || ""}
          name="phone"
          placeholder="Phone Number"
          required
        />
      </div>

      <div className="lg:col-6">
        <Label>Date of Birth:</Label>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"input"}
              className={cn("w-full flex justify-between")}
            >
              {data.dob ? dateFormat(data.dob) : <span>Select Date</span>}
              <span className="flex items-center">
                <span
                  className={cn("bg-light mb-2 mt-2 h-5 block w-[1px]")}
                ></span>
                <span className={cn("pl-2  block")}>
                  <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                </span>
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              required
              mode="single"
              selected={data.dob ? new Date(data.dob) : new Date()}
              onSelect={(date) => {
                if (date) {
                  setData({
                    ...data,
                    dob: formatDateWithTime(date),
                  });
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="lg:col-6">
        <Label>Gender:</Label>
        <Select
          name="gender"
          value={data.gender}
          onValueChange={(value) => setData({ ...data, gender: value as any })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            {options.employee_gender.map((status) => {
              return (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="lg:col-6">
        <Label>Marital Status:</Label>

        <Select
          onValueChange={(value) => {
            setData({ ...data, marital_status: value as any });
          }}
          name="marital_status"
          value={data.marital_status}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Marital Status" />
          </SelectTrigger>
          <SelectContent>
            {options.employee_marital_status.map((status) => {
              return (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="lg:col-6">
        <Label>Present Address:</Label>
        <Input
          onChange={handleChange}
          type="text"
          value={data.present_address || ""}
          name="present_address"
          placeholder="Present Address"
          required
        />
      </div>
      <div className="lg:col-6">
        <Label>Permanent Address:</Label>
        <Input
          onChange={handleChange}
          type="text"
          value={data.permanent_address || ""}
          name="permanent_address"
          placeholder="Permanent Address"
          required
        />
      </div>

      <div className="lg:col-6">
        <Label>Facebook Profile:</Label>
        <Input
          onChange={handleChange}
          type="url"
          value={data.facebook || ""}
          name="facebook"
          placeholder="Facebook Profile"
          required
        />
      </div>

      <div className="lg:col-6">
        <Label>Twitter(X) Profile:</Label>
        <Input
          onChange={handleChange}
          type="url"
          value={data.twitter || ""}
          name="twitter"
          placeholder="X profile"
          required
        />
      </div>

      <div className="lg:col-6">
        <Label>Linkedin Profile:</Label>
        <Input
          onChange={handleChange}
          type="url"
          value={data.linkedin || ""}
          name="linkedin"
          placeholder="Linkedin Profile"
          required
        />
      </div>

      <div className="lg:col-6">
        <Label>Blood Group:</Label>

        <Select
          onValueChange={(value) => {
            setData({ ...data, blood_group: value as any });
          }}
          name="blood_group"
          value={data.blood_group}
          required
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
      </div>

      <div className="lg:col-6">
        <Label>NID:</Label>
        <Input
          onChange={handleChange}
          type="text"
          value={data.nid || ""}
          name="nid"
          placeholder="NID"
          required
        />
      </div>

      <div className="lg:col-6">
        <Label>Tin:</Label>
        <Input
          onChange={handleChange}
          type="text"
          value={data.tin || ""}
          name="tin"
          placeholder="Tin"
        />
      </div>

      <div className="text-right">
        <DialogClose type="button" className="sr-only" ref={buttonRef}>
          Modal close
        </DialogClose>
        <Button disabled={isUpdating} variant={"outline"} size={"lg"}>
          Submit
          {isUpdating && <Loader2 className="ml-1.5 h-4 w-4 animate-spin" />}
        </Button>
      </div>
    </form>
  );
}
