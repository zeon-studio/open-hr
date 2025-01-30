import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditFrom from "@/partials/EditFrom";
import {
  useGetSettingQuery,
  useUpdateSettingMutation,
} from "@/redux/features/settingApiSlice/settingSlice";
import { TSetting } from "@/redux/features/settingApiSlice/settingType";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";

export default function SettingPage() {
  const { data, isLoading } = useGetSettingQuery(undefined);
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();

  if (isLoading) {
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

  const handleSubmit = (data: TSetting) => {
    updateSetting(data);
  };

  return (
    <div className="space-y-10">
      <EditFrom<TSetting>
        isUpdating={isUpdating}
        data={data?.result!}
        title="Settings"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          return (
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(data);
              }}
              className="row gap-y-4"
            >
              <div className="lg:col-6">
                <Label>App Name:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.app_name || ""}
                  name="app_name"
                  placeholder="App Name"
                  readOnly={isReadOnly}
                />
              </div>
            </form>
          );
        }}
      </EditFrom>
    </div>
  );
}
