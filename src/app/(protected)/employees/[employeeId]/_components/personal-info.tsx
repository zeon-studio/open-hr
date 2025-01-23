import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
import { TEmployeeEducation } from "@/redux/features/employeeEducationApiSlice/employeeEducationType";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { notFound, useParams } from "next/navigation";

export default function PersonalInfo() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { data: session } = useSession();
  const { data, isLoading } = useGetEmployeeQuery(
    employeeId ?? session?.user.id!
  );
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();

  const { data: bankDetails, isLoading: isBankLoading } =
    useGetEmployeeBankQuery(employeeId ?? session?.user.id!);

  const { data: educationDetails, isLoading: isEducationLoading } =
    useGetEmployeeEducationQuery(employeeId ?? session?.user.id!);

  if (isLoading || isBankLoading || isEducationLoading) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <Loader2 className="animate-spin size-5 mx-auto" />
        </CardContent>
      </Card>
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
        data={data?.result!}
        title="Personal Details"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          return (
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(data);
              }}
              className="lg:grid lg:grid-cols-2 gap-3"
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
        data={bankDetails?.result!}
        title="Bank Details (If any)"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          return (
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="grid gap-3"
              ref={formRef}
            >
              {data.banks.length > 0 ? (
                data?.banks?.map((bank, index, banks) => {
                  return (
                    <div key={index} className="grid lg:grid-cols-2 gap-3">
                      <div>
                        <Label>Account Name</Label>
                        <Input
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleChange({
                              ...data,
                              banks: banks.map((bank, i) => {
                                if (index === i) {
                                  return { ...bank, [name]: value };
                                }
                                return bank;
                              }),
                            });
                          }}
                          value={bank.bank_ac_name}
                          readOnly={isReadOnly}
                          name="bank_ac_name"
                          placeholder="Bank Account Name"
                        />
                      </div>
                      <div>
                        <Label>Bank Name</Label>
                        <Input
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleChange({
                              ...data,
                              banks: banks.map((bank, i) => {
                                if (index === i) {
                                  return { ...bank, [name]: value };
                                }
                                return bank;
                              }),
                            });
                          }}
                          readOnly={isReadOnly}
                          value={bank.bank_name}
                          name="bank_name"
                          placeholder="Your Bank Account Number"
                        />
                      </div>
                      <div>
                        <Label>Bank Account Number</Label>
                        <Input
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleChange({
                              ...data,
                              banks: banks.map((bank, i) => {
                                if (index === i) {
                                  return { ...bank, [name]: value };
                                }
                                return bank;
                              }),
                            });
                          }}
                          readOnly={isReadOnly}
                          name="bank_ac_no"
                          value={bank.bank_ac_no}
                          placeholder="Your Bank Account Number"
                        />
                      </div>
                      <div>
                        <Label>Branch</Label>
                        <Input
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleChange({
                              ...data,
                              banks: banks.map((bank, i) => {
                                if (index === i) {
                                  return { ...bank, [name]: value };
                                }
                                return bank;
                              }),
                            });
                          }}
                          readOnly={isReadOnly}
                          value={bank.bank_branch}
                          name="bank_branch"
                        />
                      </div>
                      {banks.length - 1 !== index && (
                        <Separator className="my-4 lg:col-span-2" />
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="py-4">No bank account information available.</p>
              )}
              <Button
                onClick={() => {
                  handleChange({
                    ...data,
                    banks: [
                      ...data.banks,
                      {
                        bank_ac_no: "",
                        bank_branch: "",
                        bank_ac_name: "",
                        bank_district: "",
                        bank_name: "",
                        bank_routing_no: "",
                      },
                    ],
                  });
                }}
              >
                Add More
              </Button>
            </form>
          );
        }}
      </EditFrom>

      <EditFrom<TEmployeeEducation>
        isUpdating={isUpdating}
        data={educationDetails?.result!}
        title="Educational Details"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          return (
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="grid grid-cols-1 gap-3"
              ref={formRef}
            >
              {data.educations.length > 0 ? (
                data?.educations?.map((education, index, educations) => {
                  return (
                    <div key={index} className="lg:grid lg:grid-cols-2 gap-3">
                      <div>
                        <Label>Degree</Label>
                        <Input
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleChange({
                              ...data,
                              educations: educations.map((education, i) => {
                                if (index === i) {
                                  return { ...education, [name]: value };
                                }
                                return education;
                              }),
                            });
                          }}
                          value={education.degree}
                          readOnly={isReadOnly}
                          name="degree"
                          placeholder="Degree"
                        />
                      </div>
                      <div>
                        <Label>Name of Institution</Label>
                        <Input
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleChange({
                              ...data,
                              educations: educations.map((education, i) => {
                                if (index === i) {
                                  return { ...education, [name]: value };
                                }
                                return education;
                              }),
                            });
                          }}
                          readOnly={isReadOnly}
                          value={education.institute}
                          name="institute"
                          placeholder="Institute name"
                        />
                      </div>
                      <div>
                        <Label>Passing Year</Label>
                        <Input
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleChange({
                              ...data,
                              educations: educations.map((education, i) => {
                                if (index === i) {
                                  return { ...education, [name]: value };
                                }
                                return education;
                              }),
                            });
                          }}
                          readOnly={isReadOnly}
                          name="bank_ac_no"
                          value={education.passing_year}
                          placeholder="Passing year"
                        />
                      </div>
                      <div>
                        <Label>Branch</Label>
                        <Input
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleChange({
                              ...data,
                              educations: educations.map((education, i) => {
                                if (index === i) {
                                  return { ...education, [name]: value };
                                }
                                return education;
                              }),
                            });
                          }}
                          readOnly={isReadOnly}
                          value={education.major}
                          name="major"
                        />
                      </div>

                      <div>
                        <Label>Branch</Label>
                        <Input
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleChange({
                              ...data,
                              educations: educations.map((education, i) => {
                                if (index === i) {
                                  return { ...education, [name]: value };
                                }
                                return education;
                              }),
                            });
                          }}
                          readOnly={isReadOnly}
                          value={education.result}
                          name="result"
                        />
                      </div>
                      {educations.length - 1 !== index && (
                        <Separator className="my-4 lg:col-span-2" />
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="py-4">No Education information available. </p>
              )}

              <Button
                onClick={() => {
                  handleChange({
                    ...data,
                    educations: [
                      ...data.educations,
                      {
                        degree: "",
                        major: "",
                        result: "",
                        institute: "",
                        passing_year: 0,
                      },
                    ],
                  });
                }}
                type="button"
              >
                Add More
              </Button>
            </form>
          );
        }}
      </EditFrom>
    </div>
  );
}
