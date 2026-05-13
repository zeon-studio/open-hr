import options from "@/config/options.json";
import EditFrom from "@/partials/edit-from";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateSettingSectionsAction } from "../_actions/update-setting-sections";
import { TSetting } from "../_types/setting";

interface SettingLeavesFormProps {
  data: TSetting;
}

export default function SettingLeavesForm({ data }: SettingLeavesFormProps) {
  const [isActionUpdating, setIsActionUpdating] = useState(false);

  return (
    <EditFrom<TSetting>
      isUpdating={isActionUpdating}
      data={data}
      title="Leaves"
    >
      {({ handleChange, isReadOnly, data, formRef }) => {
        return (
          <form
            ref={formRef}
            onSubmit={async (e) => {
              e.preventDefault();
              setIsActionUpdating(true);
              try {
                const actionResult = await updateSettingSectionsAction({
                  max_leave_per_day: data.max_leave_per_day,
                  leave_threshold_days: data.leave_threshold_days,
                  leaves: data.leaves,
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
            className="row"
          >
            {/* Leave Threshold Days */}
            <div className="lg:col-6 mb-5">
              <Label>Leave Threshold Days:</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({ ...data, [name]: Number(value) });
                }}
                type="number"
                value={data.leave_threshold_days ?? ""}
                name="leave_threshold_days"
                placeholder="Leave Threshold Days"
                readOnly={isReadOnly}
              />
            </div>

            {/* Max Leave Per Day */}
            <div className="lg:col-6 mb-5">
              <Label>Max Leave Per Day:</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({ ...data, [name]: Number(value) });
                }}
                type="number"
                value={data.max_leave_per_day || ""}
                name="max_leave_per_day"
                placeholder="Maximum Leave Per Day"
                readOnly={isReadOnly}
              />
            </div>

            {/* Leaves */}
            <div className="lg:col-12 mt-10">
              {data.leaves.map((leave, index) => (
                <div
                  className={`${!isReadOnly && "p-5 bg-light relative"} ${isReadOnly && index !== 0 && "border-t border-border pt-5"} mb-5`}
                  key={index}
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
                            leaves: data.leaves.filter((_, i) => i !== index),
                          });
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  )}
                  <div className="row relative">
                    <div className="lg:col-6 mb-4">
                      <Label>Leave Type:</Label>
                      {isReadOnly ? (
                        <small className="block capitalize">{leave.name}</small>
                      ) : (
                        <Select
                          value={leave.name}
                          onValueChange={(value) =>
                            handleChange({
                              ...data,
                              leaves: data.leaves.map((leave, i) =>
                                i === index
                                  ? {
                                      ...leave,
                                      name: value as
                                        | "casual"
                                        | "earned"
                                        | "sick"
                                        | "without_pay",
                                    }
                                  : leave,
                              ),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                          <SelectContent>
                            {options.leave_type.map((item) => (
                              <SelectItem value={item.value} key={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="lg:col-6 mb-4">
                      <Label>Day Count:</Label>
                      <Input
                        onChange={(e) => {
                          const { name, value } = e.target;
                          handleChange({
                            ...data,
                            leaves: data.leaves.map((leave, i) =>
                              i === index
                                ? { ...leave, [name]: Number(value) }
                                : leave,
                            ),
                          });
                        }}
                        type="number"
                        value={leave.days || ""}
                        name="days"
                        placeholder="Days"
                        readOnly={isReadOnly}
                      />
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
                      leaves: [...data.leaves, { name: "casual", days: 0 }],
                    });
                  }}
                >
                  Add Leave
                </Button>
              )}
            </div>
          </form>
        );
      }}
    </EditFrom>
  );
}
