import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import options from "@/config/options.json";
import MultipleSelector from "@/layouts/components/ui/multiple-selector";
import EditFrom from "@/partials/edit-from";
import { TSetting } from "@/redux/features/settingApiSlice/settingType";
import { Trash2 } from "lucide-react";

interface SettingMenuFormProps {
  isUpdating: boolean;
  data: TSetting;
  handleSubmit: (data: TSetting) => void;
}

export default function SettingMenuForm({
  isUpdating,
  data,
  handleSubmit,
}: SettingMenuFormProps) {
  return (
    <EditFrom<TSetting> isUpdating={isUpdating} data={data} title="Menu">
      {({ handleChange, isReadOnly, data, formRef }) => {
        return (
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(data);
            }}
          >
            {data.menus.map((menu, index) => (
              <div
                key={index}
                className={`${isReadOnly ? "bg-white" : "bg-light px-5 pt-5 mb-5"} ${index !== 0 && isReadOnly && "border-t pt-5"} rounded relative`}
              >
                {!isReadOnly && (
                  <div className="absolute right-5 top-3">
                    <Button
                      type="button"
                      size={"xs"}
                      variant="outline"
                      onClick={() => {
                        handleChange({
                          ...data,
                          menus: data.menus.filter((_, i) => i !== index),
                        });
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                )}
                <div className="row gx-3">
                  <div className="lg:col-6 mb-4">
                    <Label>Name:</Label>
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          menus: data.menus.map((menu, i) =>
                            i === index
                              ? {
                                  ...menu,
                                  [name]: value as
                                    | "admin"
                                    | "user"
                                    | "moderator",
                                }
                              : menu
                          ),
                        });
                      }}
                      type="text"
                      value={menu.name || ""}
                      name="name"
                      placeholder="Menu Name"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="lg:col-6 mb-4">
                    <Label>URL:</Label>
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          menus: data.menus.map((menu, i) =>
                            i === index ? { ...menu, [name]: value } : menu
                          ),
                        });
                      }}
                      type="text"
                      value={menu.url || ""}
                      name="url"
                      placeholder="Menu URL"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="lg:col-12 mb-4">
                    <Label>Access:</Label>
                    {isReadOnly ? (
                      <small className="block capitalize">
                        {menu.access.join(", ")}
                      </small>
                    ) : (
                      <MultipleSelector
                        value={menu.access.map((access) => ({
                          label: access,
                          value: access,
                        }))}
                        options={options.menu_access}
                        placeholder="Select access"
                        hidePlaceholderWhenSelected={true}
                        onChange={(value) => {
                          handleChange({
                            ...data,
                            menus: data.menus.map((menu, i) =>
                              i === index
                                ? {
                                    ...menu,
                                    access: value.map(
                                      (v) =>
                                        v.value as
                                          | "admin"
                                          | "user"
                                          | "moderator"
                                    ),
                                  }
                                : menu
                            ),
                          });
                        }}
                        className="border-border/30"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
            {!isReadOnly && (
              <Button
                variant="outline"
                className="w-full mt-6"
                type="button"
                onClick={() => {
                  handleChange({
                    ...data,
                    menus: [...data.menus, { name: "", url: "", access: [] }],
                  });
                }}
              >
                Add Menu
              </Button>
            )}
          </form>
        );
      }}
    </EditFrom>
  );
}
