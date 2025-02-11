import { moduleIcons } from "@/components/icons";
import EditFrom from "@/layouts/partials/edit-from";
import { titleify } from "@/lib/text-converter";
import { useUpdateSettingModuleStatusMutation } from "@/redux/features/settingApiSlice/settingSlice";
import {
  TModuleItem,
  TSetting,
} from "@/redux/features/settingApiSlice/settingType";
import { Badge } from "@/ui/badge";
import { Switch } from "@/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SettingModuleForm = ({ data }: { data: TSetting }) => {
  const [loader, setLoader] = useState(false);

  const [updateModuleStatus, { isSuccess, isError, error }] =
    useUpdateSettingModuleStatusMutation();

  const [initialData, setInitialData] = useState<TModuleItem[]>([]);

  useEffect(() => {
    if (data.modules.length > 0) {
      setInitialData(data.modules);
    }
  }, [data.modules]);

  useEffect(() => {
    if (isSuccess) {
      toast("Module update complete");
    } else if (isError) {
      toast("Something went wrong");
      console.log(error);
    }
    setLoader(false);
  }, [isSuccess, isError, error]);

  const handleSubmit = async (data: TModuleItem[]) => {
    setLoader(true);
    try {
      const payload = [
        ...data.map(({ name, enable }) => ({
          name,
          enable,
        })),
      ];
      await Promise.all(payload.map(updateModuleStatus));
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  return (
    <EditFrom<TModuleItem[]>
      isUpdating={loader}
      data={initialData}
      key={JSON.stringify(initialData)}
      title="Modules"
    >
      {({ handleChange, isReadOnly, data, formRef }) => {
        return (
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(data);
            }}
            className="row gx-3 2xl:row-cols-5 xl:row-cols-3 lg:row-cols-3 md:row-cols-3 sm:row-cols-2 row-cols-1"
          >
            {data?.map((item, i) => {
              const Icon = moduleIcons[item.name];
              return (
                <div key={`module-${item.name}`} className={"col mb-4"}>
                  <div className="border rounded p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="p-2 bg-light rounded">
                        <Icon className="size-5" />
                      </span>
                      {isReadOnly ? (
                        <Badge
                          variant={item.enable ? "success" : "destructive"}
                        >
                          {item.enable ? "Enabled" : "Disabled"}
                        </Badge>
                      ) : (
                        <Switch
                          defaultChecked={item.enable}
                          name="enable"
                          onCheckedChange={() => {
                            handleChange([
                              ...data.map((item, index) => {
                                if (index === i) {
                                  return {
                                    ...item,
                                    enable: !item.enable,
                                  };
                                }
                                return item;
                              }),
                            ]);
                          }}
                        />
                      )}
                    </div>
                    <strong className="block">{titleify(item.name)}</strong>
                    <small className="text-text-light">
                      {item.description}
                    </small>
                  </div>
                </div>
              );
            })}
          </form>
        );
      }}
    </EditFrom>
  );
};

export default SettingModuleForm;
