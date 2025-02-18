import { moduleIcons } from "@/components/icons";
import ConfirmationPopup from "@/layouts/components/confirmation-popup";
import { titleify } from "@/lib/text-converter";
import { useUpdateSettingModuleStatusMutation } from "@/redux/features/settingApiSlice/settingSlice";
import {
  TModuleItem,
  TSetting,
} from "@/redux/features/settingApiSlice/settingType";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Switch } from "@/ui/switch";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SettingModuleForm = ({ data }: { data: TSetting }) => {
  const [updateModuleStatus, { isSuccess, isError, error }] =
    useUpdateSettingModuleStatusMutation();

  const [initialData, setInitialData] = useState<TModuleItem[]>([]);
  const [selectedModule, setSelectedModule] = useState<TModuleItem | null>(
    null
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
  }, [isSuccess, isError, error]);

  const handleSubmit = async (data: TModuleItem[]) => {
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
    }
  };

  const handleChange = async (updatedModule: TModuleItem, index: number) => {
    const updatedData = initialData.map((module, i) =>
      i === index ? updatedModule : module
    );
    setInitialData(updatedData);
    try {
      await updateModuleStatus(updatedModule);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmation = () => {
    if (selectedModule && selectedIndex !== null) {
      handleChange(selectedModule, selectedIndex);
    }
  };

  return (
    <Card>
      <CardHeader className="border-0 pb-0">
        <CardTitle>Modules</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(initialData);
          }}
          className="row gx-3 2xl:row-cols-5 xl:row-cols-3 lg:row-cols-3 md:row-cols-3 sm:row-cols-2 row-cols-1"
        >
          {initialData?.map((item, i) => {
            const Icon = moduleIcons[item.name];
            return (
              <div key={`module-${item.name}`} className={"col mb-4"}>
                <div className="border border-border rounded p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="p-2 bg-light rounded">
                      <Icon className="size-5" />
                    </span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div>
                          <Switch
                            defaultChecked={item.enable}
                            name="enable"
                            onCheckedChange={() => {
                              setSelectedModule({
                                ...item,
                                enable: !item.enable,
                              });
                              setSelectedIndex(i);
                            }}
                          />
                        </div>
                      </DialogTrigger>
                      <ConfirmationPopup
                        handleConfirmation={handleConfirmation}
                        skipWrite={true}
                        description="Are you sure you want to update this module?"
                      />
                    </Dialog>
                  </div>
                  <strong className="block">{titleify(item.name)}</strong>
                  <small className="text-text-light">{item.description}</small>
                </div>
              </div>
            );
          })}
        </form>
      </CardContent>
    </Card>
  );
};

export default SettingModuleForm;
