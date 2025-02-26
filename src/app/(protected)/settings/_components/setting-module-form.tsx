import { modules } from "@/config/modules";
import ConfirmationPopup from "@/layouts/components/confirmation-popup";
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
  const [enabledModules, setEnabledModules] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedModule, setSelectedModule] = useState<TModuleItem | null>(
    null
  );

  // Initialize enabled states from data.modules
  useEffect(() => {
    const moduleStates = data.modules.reduce(
      (acc, module) => {
        acc[module.name] = module.enable;
        return acc;
      },
      {} as Record<string, boolean>
    );
    setEnabledModules(moduleStates);
  }, [data.modules]);

  useEffect(() => {
    if (isSuccess) {
      toast("Module update complete");
    } else if (isError) {
      toast("Something went wrong");
      console.log(error);
    }
  }, [isSuccess, isError, error]);

  const handleModuleToggle = async (identifier: string) => {
    const newState = !enabledModules[identifier];
    try {
      await updateModuleStatus({
        name: identifier,
        enable: newState,
      });
      setEnabledModules((prev) => ({
        ...prev,
        [identifier]: newState,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <CardHeader className="border-0 pb-0">
        <CardTitle>Modules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="row gx-3 2xl:row-cols-5 xl:row-cols-3 lg:row-cols-3 md:row-cols-3 sm:row-cols-2 row-cols-1">
          {modules.map((module) => {
            return (
              <div key={module.identifier} className="col mb-4">
                <div className="border border-border rounded p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="p-2 bg-light rounded">
                      <module.icon className="size-5" />
                    </span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div>
                          <Switch
                            checked={enabledModules[module.identifier] || false}
                            name="enable"
                            onCheckedChange={() => {
                              setSelectedModule({
                                name: module.identifier,
                                enable: !enabledModules[module.identifier],
                              });
                            }}
                          />
                        </div>
                      </DialogTrigger>
                      <ConfirmationPopup
                        handleConfirmation={() => {
                          if (selectedModule) {
                            handleModuleToggle(selectedModule.name);
                          }
                        }}
                        skipWrite={true}
                        description="Are you sure you want to update this module?"
                      />
                    </Dialog>
                  </div>
                  <strong className="block">{module.name}</strong>
                  <small className="text-text-light">
                    {module.description}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingModuleForm;
