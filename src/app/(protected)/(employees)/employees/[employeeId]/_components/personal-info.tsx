import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import EditFrom from "@/partials/EditFrom";
import {
  useGetEmployeeQuery,
  useUpdateEmployeeMutation,
} from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { useGetEmployeeBankQuery } from "@/redux/features/employeeBankApiSlice/employeeBankSlice";
import { TEmployeeBank } from "@/redux/features/employeeBankApiSlice/employeeBankType";
import { useGetEmployeeEducationQuery } from "@/redux/features/employeeEducationApiSlice/employeeEducationSlice";
import { useSession } from "next-auth/react";
import { notFound, useParams } from "next/navigation";
import { useRef } from "react";

export default function PersonalInfo() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session } = useSession();
  const { data, isLoading } = useGetEmployeeQuery(
    employeeId ?? session?.user.id!
  );
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();

  const { data: bankDetails, isLoading: isBankLoading } =
    useGetEmployeeBankQuery(employeeId ?? session?.user.id!);
  console.log(bankDetails);

  const { data: educationDetails } = useGetEmployeeEducationQuery(
    employeeId ?? session?.user.id!
  );

  if (isLoading || isBankLoading) {
    return (
      <div>
        <p>loading...</p>
      </div>
    );
  }

  if (!isLoading && !data?.result) {
    notFound();
  }

  const handleSubmit = (data: TEmployee) => {
    updateEmployee(data);
  };

  return (
    <div className="space-y-10">
      <EditFrom<TEmployee>
        isUpdating={isUpdating}
        formRef={formRef}
        data={data?.result!}
        title="Personal Details"
      >
        {({ handleChange, isReadOnly, data }) => {
          return (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(data);
              }}
              className="grid grid-cols-2 gap-3"
              ref={formRef}
            >
              <div>
                <Label>Name</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  value={data.name}
                  readOnly={isReadOnly}
                  name="name"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <Label>Work Email</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  value={data.work_email}
                  readOnly={isReadOnly}
                  name="work_email"
                  placeholder="Your Work Email"
                />
              </div>
              <div>
                <Label>Mobile Phone:</Label>
                <Input
                  readOnly={isReadOnly}
                  name="phone"
                  value={data.phone}
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <Label>NID</Label>
                <Input
                  readOnly={isReadOnly}
                  type="number"
                  name="nid"
                  value={data.nid}
                  placeholder="Your NID"
                />
              </div>
              <div>
                <Label>Present Address:</Label>
                <Input
                  readOnly={isReadOnly}
                  name="present_address"
                  value={data.present_address}
                  placeholder="Your present address"
                />
              </div>
              <div>
                <Label>Permanent Address</Label>
                <Input
                  readOnly={isReadOnly}
                  name="present_address"
                  value={data.permanent_address}
                  placeholder="Your permanent address"
                />
              </div>
              <div>
                <Label>Blood Group:</Label>
                {isReadOnly ? (
                  <p className="text-sm font-semibold">
                    {data.blood_group || "Not Available"}
                  </p>
                ) : (
                  <Select name="blood_group" value={data.blood_group}>
                    <SelectTrigger>
                      <SelectValue placeholder="Blood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <Label>Marital Status:</Label>
                {isReadOnly ? (
                  <p className="text-sm font-semibold">
                    {data.marital_status || "Not Available"}
                  </p>
                ) : (
                  <Select name="marital_status" value={data.marital_status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Blood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Unmarried">Unmarried</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {!isReadOnly && (
                <>
                  <div>
                    <Label>Tin</Label>
                    <Input name="tin" value={data.tin} />
                  </div>
                  <div>
                    <Label>Facebook</Label>
                    <Input type="url" name="facebook" value={data.facebook} />
                  </div>
                  <div>
                    <Label>Twitter</Label>
                    <Input type="url" name="twitter" value={data.twitter} />
                  </div>
                  <div>
                    <Label>Linkedin</Label>
                    <Input type="url" name="linkedin" value={data.linkedin} />
                  </div>
                  <div>
                    <Label>Discord</Label>
                    <Input type="text" name="discord" value={data.discord} />
                  </div>
                  <div>
                    <Label>Personality</Label>
                    <Input type="text" name="phone" value={data.personality} />
                  </div>
                  <div className="col-span-2">
                    <Label>Note</Label>
                    <Textarea />
                  </div>
                </>
              )}
            </form>
          );
        }}
      </EditFrom>

      <EditFrom<TEmployeeBank>
        isUpdating={isUpdating}
        formRef={formRef}
        data={bankDetails?.result!}
        title="Bank Details (If any)"
      >
        {({ handleChange, isReadOnly, data }) => {
          return (
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="grid grid-cols-2 gap-3"
              ref={formRef}
            >
              {data?.banks?.map((bank, index) => {
                return (
                  <div key={index}>
                    <div>
                      <Label>Account Name</Label>
                      <Input
                        onChange={(e) => {
                          const { name, value } = e.target;
                          handleChange({
                            ...data,
                            [name]: value,
                          });
                        }}
                        readOnly={isReadOnly}
                        name="name"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <Label>Bank Account Number</Label>
                      <Input
                        onChange={(e) => {
                          const { name, value } = e.target;
                          handleChange({
                            ...data,
                            [name]: value,
                          });
                        }}
                        readOnly={isReadOnly}
                        name="work_email"
                        placeholder="Your Email"
                      />
                    </div>
                    <div>
                      <Label>Bank Name</Label>
                      <Input
                        readOnly={isReadOnly}
                        name="phone"
                        placeholder="Your Phone Number"
                      />
                    </div>

                    <div>
                      <Label>Branch</Label>
                      <Input readOnly={isReadOnly} type="number" name="nid" />
                    </div>
                  </div>
                );
              })}
            </form>
          );
        }}
      </EditFrom>
    </div>
  );
}
