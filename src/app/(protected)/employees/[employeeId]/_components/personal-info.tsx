import {
  useGetEmployeeQuery,
  useUpdateEmployeeMutation,
  useUpdateEmployeePasswordMutation,
} from "@/redux/features/employeeApiSlice/employeeSlice";
import {
  useGetEmployeeBankQuery,
  useUpdateEmployeeBankMutation,
} from "@/redux/features/employeeBankApiSlice/employeeBankSlice";
import {
  useGetEmployeeEducationQuery,
  useUpdateEmployeeEducationMutation,
} from "@/redux/features/employeeEducationApiSlice/employeeEducationSlice";
import { useAppSelector } from "@/redux/hook";
import { Card, CardContent } from "@/ui/card";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import BankForm from "./bank-form";
import EducationForm from "./education-form";
import PasswordForm from "./password-form";
import PersonalForm from "./personal-form";

export default function PersonalInfo() {
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
      {/* Personal Form */}
      <PersonalForm
        data={personalDetails?.result!}
        isUpdating={isPersonalUpdating}
        isUser={isUser}
        communication_platform={communication_platform}
        onSubmit={updateEmployee}
      />

      {/* Password Form */}
      {session?.user.id === employeeId && (
        <PasswordForm
          data={{
            id: employeeId,
            current_password: "",
            new_password: "",
          }}
          isUpdating={isPasswordUpdating}
          onSubmit={(data) =>
            updatePassword({
              id: employeeId,
              current_password: data.current_password,
              new_password: data.new_password,
            })
          }
        />
      )}

      {/* Bank Form */}
      {modules.find((mod) => mod.name === "employee-bank")?.enable && (
        <BankForm
          data={bankDetails?.result!}
          isUpdating={isBankInfoUpdating}
          onSubmit={(data) =>
            updateBankInfo({
              employee_id: employeeId,
              banks: data?.banks,
            })
          }
        />
      )}

      {/* Education Form */}
      {modules.find((mod) => mod.name === "employee-education")?.enable && (
        <EducationForm
          data={educationDetails?.result!}
          isUpdating={isEducationUpdating}
          onSubmit={(data) =>
            updateEducationInfo({
              employee_id: employeeId,
              educations: data?.educations,
            })
          }
        />
      )}
    </div>
  );
}
