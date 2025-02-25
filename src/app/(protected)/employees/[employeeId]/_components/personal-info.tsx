import options from "@/config/options.json";
import { dateFormat } from "@/lib/date-converter";
import { cn } from "@/lib/shadcn";
import EditFrom from "@/partials/edit-from";
import {
  useGetEmployeeQuery,
  useUpdateEmployeeMutation,
  useUpdateEmployeePasswordMutation,
} from "@/redux/features/employeeApiSlice/employeeSlice";
import {
  TEmployee,
  TEmployeePasswordUpdate,
} from "@/redux/features/employeeApiSlice/employeeType";
import {
  useGetEmployeeBankQuery,
  useUpdateEmployeeBankMutation,
} from "@/redux/features/employeeBankApiSlice/employeeBankSlice";
import { TEmployeeBank } from "@/redux/features/employeeBankApiSlice/employeeBankType";
import {
  useGetEmployeeEducationQuery,
  useUpdateEmployeeEducationMutation,
} from "@/redux/features/employeeEducationApiSlice/employeeEducationSlice";
import { TEmployeeEducation } from "@/redux/features/employeeEducationApiSlice/employeeEducationType";
import { useAppSelector } from "@/redux/hook";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Card, CardContent } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import PasswordInput from "@/ui/password-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Separator } from "@/ui/separator";
import { Textarea } from "@/ui/textarea";
import { CalendarIcon, Loader2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PersonalInfo() {
  // get modules and communication platform from settings
  const { modules, communication_platform } = useAppSelector(
    (state) => state["setting-slice"]
  );
  // session
  const { data: session } = useSession();
  const isUser = session?.user.role === "user";
  let { employeeId } = useParams<{ employeeId: string }>();

  if (!employeeId) {
    employeeId = session?.user.id as string;
  }

  // get employee data
  const { data: personalDetails, isLoading: isPersonalLoading } =
    useGetEmployeeQuery(employeeId ?? session?.user.id!);

  // update employee details
  const [
    updateEmployee,
    {
      isLoading: isPersonalUpdating,
      isSuccess: isEmployeeUpdateSuccess,
      isError: isEmployeeUpdateError,
    },
  ] = useUpdateEmployeeMutation();

  // update employee details
  useEffect(() => {
    if (isEmployeeUpdateSuccess) {
      toast("Employee details updated successfully");
    } else if (isEmployeeUpdateError) {
      toast("Failed to update employee details");
    }
  }, [isEmployeeUpdateSuccess, isEmployeeUpdateError]);

  // update employee password
  const [
    updatePassword,
    {
      isLoading: isPasswordUpdating,
      isSuccess: isPasswordUpdateSuccess,
      isError: isPasswordUpdateError,
    },
  ] = useUpdateEmployeePasswordMutation();

  // update employee password
  useEffect(() => {
    if (isPasswordUpdateSuccess) {
      toast("Password updated successfully");
    } else if (isPasswordUpdateError) {
      toast("Failed to update password");
    }
  }, [isPasswordUpdateSuccess, isPasswordUpdateError]);

  // get employee bank
  const { data: bankDetails, isLoading: isBankLoading } =
    useGetEmployeeBankQuery(employeeId ?? session?.user.id!);

  // update employee bank
  const [
    updateBankInfo,
    {
      isLoading: isBankInfoUpdating,
      isSuccess: isBankUpdateSuccess,
      isError: isBankUpdateError,
    },
  ] = useUpdateEmployeeBankMutation();

  // update employee bank
  useEffect(() => {
    if (isBankUpdateSuccess) {
      toast("Bank details updated successfully");
    } else if (isBankUpdateError) {
      toast("Failed to update bank details");
    }
  }, [isBankUpdateSuccess, isBankUpdateError]);

  // get employee education
  const { data: educationDetails, isLoading: isEducationLoading } =
    useGetEmployeeEducationQuery(employeeId ?? session?.user.id!);

  // update employee education
  const [
    updateEducationInfo,
    {
      isLoading: isEducationUpdating,
      isSuccess: isEducationUpdateSuccess,
      isError: isEducationUpdateError,
    },
  ] = useUpdateEmployeeEducationMutation();

  // update employee education
  useEffect(() => {
    if (isEducationUpdateSuccess) {
      toast("Education details updated successfully");
    } else if (isEducationUpdateError) {
      toast("Failed to update education details");
    }
  }, [isEducationUpdateSuccess, isEducationUpdateError]);

  // loading
  if (isPersonalLoading || isBankLoading || isEducationLoading) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <Loader2 className="animate-spin size-5 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  // if data not found
  if (!isPersonalLoading && !personalDetails?.result) {
    notFound();
  }

  return (
    <div className="space-y-10">
      {/* Personal details */}
      <EditFrom<TEmployee>
        isUpdating={isPersonalUpdating}
        data={personalDetails?.result!}
        title="Personal Details"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          return (
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                updateEmployee(data);
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
                        {data.dob ? (
                          dateFormat(data.dob)
                        ) : (
                          <span>Select Date</span>
                        )}
                        <span className="flex items-center">
                          <span
                            className={cn(
                              "bg-light mb-2 mt-2 h-5 block w-[1px]",
                              isReadOnly && "hidden"
                            )}
                          ></span>
                          <span
                            className={cn(
                              "pl-2  block",
                              isReadOnly && "hidden"
                            )}
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
                            dob: date!,
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
                          | "A+"
                          | "A-"
                          | "B+"
                          | "B-"
                          | "O+"
                          | "O-"
                          | "AB+"
                          | "AB-",
                      })
                    }
                    name="blood_group"
                    value={data.blood_group}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Blood" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.employee_blood_group.map(
                        (employee_blood_group) => {
                          return (
                            <SelectItem
                              key={employee_blood_group.value}
                              value={employee_blood_group.value}
                            >
                              {employee_blood_group.label}
                            </SelectItem>
                          );
                        }
                      )}
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
              {!isUser && (
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
          );
        }}
      </EditFrom>

      {/* password */}
      <EditFrom<TEmployeePasswordUpdate>
        isUpdating={isPasswordUpdating}
        data={{
          id: employeeId,
          current_password: "",
          new_password: "",
        }}
        title="Password Management"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          return (
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                updatePassword({
                  id: employeeId,
                  current_password: data.current_password,
                  new_password: data.new_password,
                });
              }}
              className="row gap-y-4"
            >
              {isReadOnly ? (
                <div className="lg:col-12">
                  <p className="text-sm">Update Your Password</p>
                </div>
              ) : (
                <>
                  <div className="lg:col-6">
                    <Label>Current Password:</Label>
                    <PasswordInput
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          [name]: value,
                        });
                      }}
                      type="password"
                      value={data.current_password || ""}
                      name="current_password"
                      placeholder="Current Password"
                      readOnly={isReadOnly}
                    />
                  </div>

                  <div className="lg:col-6">
                    <Label>New Password:</Label>
                    <PasswordInput
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          [name]: value,
                        });
                      }}
                      type="password"
                      value={data.new_password || ""}
                      name="new_password"
                      placeholder="New Password"
                      readOnly={isReadOnly}
                    />
                  </div>
                </>
              )}
            </form>
          );
        }}
      </EditFrom>

      {/* bank */}
      {modules.find((mod) => mod.name === "employee-bank")?.enable && (
        <EditFrom<TEmployeeBank>
          isUpdating={isBankInfoUpdating}
          data={bankDetails?.result!}
          title="Bank Details"
        >
          {({ handleChange, isReadOnly, data, formRef }) => {
            return (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateBankInfo({
                    employee_id: employeeId,
                    banks: data?.banks,
                  });
                }}
                className="space-y-4"
                ref={formRef}
              >
                {data?.banks.length > 0 ? (
                  data?.banks?.map((bank, index, banks) => {
                    return (
                      <div
                        key={index}
                        className={`${isReadOnly ? "bg-white" : "bg-light px-5 pt-5"} rounded relative`}
                      >
                        {!isReadOnly && (
                          <div className="lg:col-span-2 absolute right-5 top-3">
                            <Button
                              type="button"
                              size={"xs"}
                              variant="outline"
                              onClick={() => {
                                handleChange({
                                  ...data,
                                  banks: data.banks.filter(
                                    (bank, i) => i !== index
                                  ),
                                });
                              }}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        )}
                        <div className="row gx-3">
                          <div className="lg:col-6 mb-4">
                            <Label>Account Name:</Label>
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
                              value={bank.bank_ac_name || ""}
                              readOnly={isReadOnly}
                              name="bank_ac_name"
                              placeholder="Bank Account Name"
                            />
                          </div>
                          <div className="lg:col-6 mb-4">
                            <Label>Bank Name:</Label>
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
                              required
                              readOnly={isReadOnly}
                              value={bank.bank_name || ""}
                              name="bank_name"
                              placeholder="Bank Name"
                            />
                          </div>
                          <div className="lg:col-6 mb-4">
                            <Label>Bank Account Number:</Label>
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
                              required
                              readOnly={isReadOnly}
                              name="bank_ac_no"
                              value={bank.bank_ac_no || ""}
                              placeholder="Bank Account Number"
                            />
                          </div>
                          <div className="lg:col-6 mb-4">
                            <Label>Branch:</Label>
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
                              required
                              placeholder="Branch"
                              readOnly={isReadOnly}
                              value={bank.bank_branch || ""}
                              name="bank_branch"
                            />
                          </div>
                        </div>
                        {isReadOnly && banks?.length - 1 !== index && (
                          <Separator className="my-6 lg:col-span-2" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="py-4">No bank account information available.</p>
                )}
                {!isReadOnly && (
                  <Button
                    variant="outline"
                    className="w-full mt-6"
                    type="button"
                    onClick={() => {
                      handleChange({
                        ...data,
                        banks: [
                          ...(data?.banks || []),
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
                    disabled={isReadOnly}
                  >
                    Add Bank Account
                  </Button>
                )}
              </form>
            );
          }}
        </EditFrom>
      )}

      {/* education */}
      {modules.find((mod) => mod.name === "employee-education")?.enable && (
        <EditFrom<TEmployeeEducation>
          isUpdating={isEducationUpdating}
          data={educationDetails?.result!}
          title="Educational Details"
        >
          {({ handleChange, isReadOnly, data, formRef }) => {
            return (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateEducationInfo({
                    employee_id: employeeId,
                    educations: data?.educations,
                  });
                }}
                className="space-y-4"
                ref={formRef}
              >
                {data?.educations.length > 0 ? (
                  data?.educations?.map((education, index, educations) => {
                    return (
                      <div
                        className={`${isReadOnly ? "bg-white" : "bg-light px-5 pt-5"} rounded relative`}
                        key={index}
                      >
                        {!isReadOnly && (
                          <div className="lg:col-span-2 absolute right-5 top-3">
                            <Button
                              type="button"
                              size={"xs"}
                              variant="outline"
                              onClick={() => {
                                handleChange({
                                  ...data,
                                  educations: data.educations.filter(
                                    (education, i) => i !== index
                                  ),
                                });
                              }}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        )}
                        <div className="row gx-3">
                          <div className="lg:col-6 mb-4">
                            <Label>Degree:</Label>
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
                              required
                              value={education.degree || ""}
                              readOnly={isReadOnly}
                              name="degree"
                              placeholder="Degree"
                            />
                          </div>
                          <div className="lg:col-6 mb-4">
                            <Label>Name of Institution:</Label>
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
                              required
                              readOnly={isReadOnly}
                              value={education.institute || ""}
                              name="institute"
                              placeholder="Institute name"
                            />
                          </div>
                          <div className="lg:col-6 mb-4">
                            <Label>Passing Year:</Label>
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
                              type="number"
                              required
                              readOnly={isReadOnly}
                              name="passing_year"
                              value={education.passing_year || ""}
                              placeholder="Passing year"
                            />
                          </div>
                          <div className="lg:col-6 mb-4">
                            <Label>Major:</Label>
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
                              required
                              readOnly={isReadOnly}
                              value={education.major || ""}
                              name="major"
                            />
                          </div>
                          <div className="lg:col-6 mb-4">
                            <Label>Result:</Label>
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
                              type="number"
                              value={education.result || 0}
                              readOnly={isReadOnly}
                              name="result"
                              required
                            />
                          </div>
                          <div className="lg:col-6 mb-4">
                            <Label>Result Type:</Label>
                            {isReadOnly ? (
                              <p className="text-sm uppercase">
                                {data.educations[index].result_type ||
                                  "Not Available"}
                              </p>
                            ) : (
                              <Select
                                onValueChange={(value) => {
                                  handleChange({
                                    ...data,
                                    educations: educations.map(
                                      (education, i) => {
                                        if (index === i) {
                                          return {
                                            ...education,
                                            result_type: value as
                                              | "gpa"
                                              | "cgpa"
                                              | "percentage",
                                          };
                                        }
                                        return education;
                                      }
                                    ),
                                  });
                                }}
                                defaultValue={education.result_type}
                                disabled={isReadOnly}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Result Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {options.education_result_type.map(
                                    ({ label, value }) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>
                        {isReadOnly && educations.length - 1 !== index && (
                          <Separator className="my-6 lg:col-span-2" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="py-4">No Education information available. </p>
                )}

                {!isReadOnly && (
                  <Button
                    variant="outline"
                    className="w-full mt-6"
                    onClick={() => {
                      handleChange({
                        ...data,
                        educations: [
                          ...(data?.educations ?? []),
                          {
                            degree: "",
                            major: "",
                            result: 0,
                            result_type: "gpa",
                            institute: "",
                            passing_year: 0,
                          },
                        ],
                      });
                    }}
                    type="button"
                    disabled={isReadOnly}
                  >
                    Add Education
                  </Button>
                )}
              </form>
            );
          }}
        </EditFrom>
      )}
    </div>
  );
}
