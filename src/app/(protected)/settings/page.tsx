"use client";

import {
  useGetSettingQuery,
  useUpdateSettingMutation,
} from "@/redux/features/settingApiSlice/settingSlice";
import { TSetting } from "@/redux/features/settingApiSlice/settingType";
import { Card, CardContent } from "@/ui/card";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import SettingConfigureForm from "./_components/setting-configure-form";
import SettingLeavesForm from "./_components/setting-leaves-form";
import SettingModuleForm from "./_components/setting-module-form";
import SettingOffboardingTasksForm from "./_components/setting-offboarding-tasks-form";
import SettingOnboardingTasksForm from "./_components/setting-onboarding-tasks-form";
import SettingPayrollForm from "./_components/setting-payroll-form";
import SettingUserRoleForm from "./_components/setting-user-role-form";
import SettingWeekendsForm from "./_components/setting-weekends-form";

const Setting = () => {
  const { data, isLoading } = useGetSettingQuery(undefined);
  const { data: session } = useSession();
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-20 text-center">
            <Loader2 className="animate-spin size-5 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if ((!isLoading && !data?.result) || session?.user.role !== "admin") {
    notFound();
  }

  const handleSubmit = (data: TSetting) => {
    updateSetting(data);
  };

  return (
    <section className="p-6">
      <div className="space-y-10">
        <SettingModuleForm data={data?.result!} />
        <SettingConfigureForm
          isUpdating={isUpdating}
          data={data?.result!}
          handleSubmit={handleSubmit}
        />
        <SettingWeekendsForm
          isUpdating={isUpdating}
          data={data?.result!}
          handleSubmit={handleSubmit}
        />

        {data?.result.modules.find((mod) => mod.name === "payroll")?.enable && (
          <SettingPayrollForm
            isUpdating={isUpdating}
            data={data?.result!}
            handleSubmit={handleSubmit}
          />
        )}

        {data?.result.modules.find((mod) => mod.name === "leave")?.enable && (
          <SettingLeavesForm
            isUpdating={isUpdating}
            data={data?.result!}
            handleSubmit={handleSubmit}
          />
        )}

        {data?.result.modules.find((mod) => mod.name === "employee-lifecycle")
          ?.enable && (
          <SettingOnboardingTasksForm
            isUpdating={isUpdating}
            data={data?.result!}
            handleSubmit={handleSubmit}
          />
        )}

        {data?.result.modules.find((mod) => mod.name === "employee-lifecycle")
          ?.enable && (
          <SettingOffboardingTasksForm
            isUpdating={isUpdating}
            data={data?.result!}
            handleSubmit={handleSubmit}
          />
        )}

        <SettingUserRoleForm />
      </div>
    </section>
  );
};

export default Setting;
