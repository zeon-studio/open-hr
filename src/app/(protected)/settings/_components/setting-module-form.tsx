import { modules } from "@/config/modules";
import ConfirmationPopup from "@/components/confirmation-popup";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Switch } from "@/ui/switch";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { updateSettingModuleAction } from "../_actions/update-setting-module";
import { TModuleItem, TSetting } from "../_types/setting";

const SettingModuleForm = ({ data }: { data: TSetting }) => {
  // Initialize enabled states from data.modules using useMemo
  const initialModuleStates = useMemo(() => {
    return data.modules.reduce(
      (acc, module) => {
        acc[module.name] = module.enable;
        return acc;
      },
      {} as Record<string, boolean>,
    );
  }, [data.modules]);

  const [enabledModules, setEnabledModules] =
    useState<Record<string, boolean>>(initialModuleStates);
  const [selectedModule, setSelectedModule] = useState<TModuleItem | null>(
    null,
  );

  const handleModuleToggle = async (identifier: string) => {
    const newState = !enabledModules[identifier];

    try {
      const actionResult = await updateSettingModuleAction({
        name: identifier,
        enable: newState,
      });

      if (!actionResult.ok) {
        throw new Error(actionResult.error);
      }

      setEnabledModules((prev) => ({
        ...prev,
        [identifier]: newState,
      }));
      toast("Module update complete");
    } catch {
      toast("Something went wrong");
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
