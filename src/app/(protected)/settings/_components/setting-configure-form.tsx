import EditFrom from "@/partials/edit-from";
import { TSetting } from "@/redux/features/settingApiSlice/settingType";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

interface SettingConfigureFormProps {
  isUpdating: boolean;
  data: TSetting;
  handleSubmit: (data: TSetting) => void;
}

export default function SettingConfigureForm({
  isUpdating,
  data,
  handleSubmit,
}: SettingConfigureFormProps) {
  return (
    <EditFrom<TSetting> isUpdating={isUpdating} data={data} title="Settings">
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
