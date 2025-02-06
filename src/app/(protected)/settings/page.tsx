"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  useGetSettingQuery,
  useUpdateSettingMutation,
} from "@/redux/features/settingApiSlice/settingSlice";
import { TSetting } from "@/redux/features/settingApiSlice/settingType";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import SettingConfigureForm from "./_components/setting-configure-form";
import SettingLeavesForm from "./_components/setting-leaves-form";
import SettingMenuForm from "./_components/setting-menu-form";
import SettingOffboardingTasksForm from "./_components/setting-offboarding-tasks-form";
import SettingOnboardingTasksForm from "./_components/setting-onboarding-tasks-form";
import SettingUserRole from "./_components/setting-user-role";
import SettingWeekendsForm from "./_components/setting-weekends-form";

const Setting = () => {
  const { data, isLoading } = useGetSettingQuery(undefined);
  const { data: session } = useSession();
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();

  if (isLoading) {
    return (
      <div className="p-8">
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
    <section className="p-8">
      <div className="space-y-10">
        <SettingConfigureForm
          isUpdating={isUpdating}
          data={data?.result!}
          handleSubmit={handleSubmit}
        />
        <SettingMenuForm
          isUpdating={isUpdating}
          data={data?.result!}
          handleSubmit={handleSubmit}
        />
        <SettingWeekendsForm
          isUpdating={isUpdating}
          data={data?.result!}
          handleSubmit={handleSubmit}
        />
        <SettingLeavesForm
          isUpdating={isUpdating}
          data={data?.result!}
          handleSubmit={handleSubmit}
        />
        <SettingOnboardingTasksForm
          isUpdating={isUpdating}
          data={data?.result!}
          handleSubmit={handleSubmit}
        />
        <SettingOffboardingTasksForm
          isUpdating={isUpdating}
          data={data?.result!}
          handleSubmit={handleSubmit}
        />
        <SettingUserRole />
      </div>
    </section>
  );
};

export default Setting;
