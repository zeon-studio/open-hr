import { TSetting } from "@/features/settings/types";
import EditFrom from "@/layouts/edit-from";
import { useEmployeeGroupByDepartment, useEmployeeMap } from "@/hooks/use-employee-map";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SettingOffboardingTasksFormProps {
  data: TSetting;
}

export default function SettingOffboardingTasksForm({
  data,
}: SettingOffboardingTasksFormProps) {
  const employeeMap = useEmployeeMap();
  const employeeGroups = useEmployeeGroupByDepartment();
  const [isActionUpdating, setIsActionUpdating] = useState(false);

  return (
    <EditFrom<TSetting>
      isUpdating={isActionUpdating}
      data={data}
      title="Offboarding Tasks"
    >
      {({ handleChange, isReadOnly, data, formRef }) => {
        return (
          <form
            ref={formRef}
            onSubmit={async (e) => {
              e.preventDefault();
              setIsActionUpdating(true);
              try {
                const res = await fetch("/api/setting", {
                  method: "PATCH",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    offboarding_tasks: data.offboarding_tasks,
                  }),
                });

                if (!res.ok) {
                  throw new Error("Failed to update settings");
                }

                toast("Setting update complete");
              } catch {
                toast("Something went wrong");
              } finally {
                setIsActionUpdating(false);
              }
            }}
          >
            {data.offboarding_tasks.map((task, index) => (
              <div
                key={index}
                className={`${isReadOnly ? "bg-white" : "bg-light px-5 pt-5 mb-5"} ${index !== 0 && isReadOnly ? "border-t border-border pt-5" : "rounded"} relative`}
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
                          offboarding_tasks: data.offboarding_tasks.filter(
                            (_, i) => i !== index,
                          ),
                        });
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                )}
                <div className="row gx-3">
                  <div className="lg:col-6 mb-4">
                    <Label>Task Name:</Label>
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          offboarding_tasks: data.offboarding_tasks.map(
                            (task, i) =>
                              i === index ? { ...task, [name]: value } : task,
                          ),
                        });
                      }}
                      type="text"
                      value={task.name || ""}
                      name="name"
                      placeholder="Task Name"
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className="lg:col-6 mb-4">
                    <Label>Assigned To:</Label>
                    {isReadOnly ? (
                      <p className="text-sm">
                        {employeeMap.get(task.assigned_to)?.name || "N/A"}
                      </p>
                    ) : (
                      <Select
                        value={task.assigned_to || "none"}
                        onValueChange={(value) =>
                          handleChange({
                            ...data,
                            offboarding_tasks: data.offboarding_tasks.map(
                              (task, i) =>
                                i === index
                                  ? {
                                      ...task,
                                      assigned_to:
                                        value === "none" ? "" : value,
                                    }
                                  : task,
                            ),
                          })
                        }
                        disabled={isReadOnly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select User" />
                        </SelectTrigger>
                        <SelectContent>
                          {employeeGroups.map((group) => (
                            <SelectGroup key={group.label}>
                              <SelectLabel>{group.label}</SelectLabel>
                              {group.options.map(
                                (option: { value: string; label: string }) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ),
                              )}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {!isReadOnly && (
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => {
                  handleChange({
                    ...data,
                    offboarding_tasks: [
                      ...data.offboarding_tasks,
                      {
                        name: "",
                        assigned_to: "",
                      },
                    ],
                  });
                }}
              >
                Add Offboarding Task
              </Button>
            )}
          </form>
        );
      }}
    </EditFrom>
  );
}
