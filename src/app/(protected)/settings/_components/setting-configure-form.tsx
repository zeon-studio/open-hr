import EditFrom from "@/partials/edit-from";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { updateSettingConfigureAction } from "../_actions/update-setting-configure";
import { TSetting } from "../_types/setting";

interface SettingConfigureFormProps {
  data: TSetting;
}

export default function SettingConfigureForm({
  data,
}: SettingConfigureFormProps) {
  const [isActionUpdating, setIsActionUpdating] = useState(false);

  return (
    <EditFrom<TSetting>
      isUpdating={isActionUpdating}
      data={data}
      title="Settings"
    >
      {({ handleChange, isReadOnly, data, formRef }) => {
        return (
          <form
            ref={formRef}
            onSubmit={async (e) => {
              e.preventDefault();

              setIsActionUpdating(true);

              try {
                const actionResult = await updateSettingConfigureAction({
                  app_name: data.app_name || "",
                  app_url: data.app_url || "",
                  favicon_url: data.favicon_url || "",
                  logo_url: data.logo_url || "",
                  logo_width: Number(data.logo_width) || 0,
                  logo_height: Number(data.logo_height) || 0,
                  company_name: data.company_name || "",
                  company_website: data.company_website || "",
                  communication_platform: data.communication_platform || "",
                  communication_platform_url:
                    data.communication_platform_url || "",
                });

                if (!actionResult.ok) {
                  throw new Error(actionResult.error);
                }

                toast("Setting update complete");
              } catch {
                toast("Something went wrong");
              } finally {
                setIsActionUpdating(false);
              }
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
            <div className="lg:col-6">
              <Label>App URL:</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({
                    ...data,
                    [name]: value,
                  });
                }}
                type="text"
                value={data.app_url || ""}
                name="app_url"
                placeholder="App URL"
                readOnly={isReadOnly}
              />
            </div>
            <div className="lg:col-6">
              <Label>Favicon URL:</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({
                    ...data,
                    [name]: value,
                  });
                }}
                type="text"
                value={data.favicon_url || ""}
                name="favicon_url"
                placeholder="Favicon URL"
                readOnly={isReadOnly}
              />
            </div>
            <div className="lg:col-6">
              <Label>Logo URL:</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({
                    ...data,
                    [name]: value,
                  });
                }}
                type="text"
                value={data.logo_url || ""}
                name="logo_url"
                placeholder="Logo URL"
                readOnly={isReadOnly}
              />
            </div>
            <div className="lg:col-6">
              <Label>Logo Width:</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({
                    ...data,
                    [name]: value,
                  });
                }}
                type="number"
                value={data.logo_width || ""}
                name="logo_width"
                placeholder="Logo Width"
                readOnly={isReadOnly}
              />
            </div>
            <div className="lg:col-6">
              <Label>Logo Height:</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({
                    ...data,
                    [name]: value,
                  });
                }}
                type="number"
                value={data.logo_height || ""}
                name="logo_height"
                placeholder="Logo Height"
                readOnly={isReadOnly}
              />
            </div>
            <div className="lg:col-6">
              <Label>Company Name:</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({
                    ...data,
                    [name]: value,
                  });
                }}
                type="text"
                value={data.company_name || ""}
                name="company_name"
                placeholder="Company Name"
                readOnly={isReadOnly}
              />
            </div>
            <div className="lg:col-6">
              <Label>Company Website:</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({
                    ...data,
                    [name]: value,
                  });
                }}
                type="url"
                value={data.company_website || ""}
                name="company_website"
                placeholder="Company Website"
                readOnly={isReadOnly}
              />
            </div>
            <div className="lg:col-6">
              <Label>Communication Platform:</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({
                    ...data,
                    [name]: value,
                  });
                }}
                type="text"
                value={data.communication_platform || ""}
                name="communication_platform"
                placeholder="Communication Platform"
                readOnly={isReadOnly}
              />
            </div>
            <div className="lg:col-6">
              <Label>Communication Platform URL:</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({
                    ...data,
                    [name]: value,
                  });
                }}
                type="url"
                value={data.communication_platform_url || ""}
                name="communication_platform_url"
                placeholder="Communication Platform URL"
                readOnly={isReadOnly}
              />
            </div>
          </form>
        );
      }}
    </EditFrom>
  );
}
