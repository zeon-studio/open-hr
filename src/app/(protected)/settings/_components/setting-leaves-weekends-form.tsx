import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import options from "@/config/options.json";
import MultipleSelector from "@/layouts/components/ui/multiple-selector";
import EditFrom from "@/partials/EditFrom";
import { TSetting } from "@/redux/features/settingApiSlice/settingType";
import { Trash2 } from "lucide-react";

interface SettingLeavesWeekendsFormProps {
  isUpdating: boolean;
  data: TSetting;
  handleSubmit: (data: TSetting) => void;
}

export default function SettingLeavesWeekendsForm({
  isUpdating,
  data,
  handleSubmit,
}: SettingLeavesWeekendsFormProps) {
  return (
    <EditFrom<TSetting>
      isUpdating={isUpdating}
      data={data}
      title="Leaves and Weekends"
    >
      {({ handleChange, isReadOnly, data, formRef }) => {
        return (
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(data);
            }}
            className="row gap-y-8"
          >
            {/* Weekends */}
            <div className="lg:col-12">
              <Label>Weekends:</Label>
              {isReadOnly ? (
                <small className="block capitalize">
                  {data.weekends.join(", ")}
                </small>
              ) : (
                <MultipleSelector
                  value={data.weekends.map((weekend) => ({
                    label: weekend,
                    value: weekend,
                  }))}
                  options={options.weekend_days}
                  placeholder="Select weekends"
                  hidePlaceholderWhenSelected={true}
                  onChange={(value) => {
                    handleChange({
                      ...data,
                      weekends: value.map((v) => v.value),
                    });
                  }}
                  className="border-border/30"
                />
              )}
            </div>
            {/* Conditional Weekends */}
            <div className="lg:col-12">
              <Label>Conditional Weekends:</Label>
              {data.conditional_weekends.map((weekend, index) => (
                <div key={index} className="p-5 relative">
                  {!isReadOnly && (
                    <div className="lg:col-span-2 absolute right-5 top-3">
                      <Button
                        type="button"
                        size={"xs"}
                        variant="outline"
                        onClick={() => {
                          handleChange({
                            ...data,
                            conditional_weekends:
                              data.conditional_weekends.filter(
                                (_, i) => i !== index
                              ),
                          });
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  )}
                  <div className="row">
                    <div className="lg:col-6">
                      <Label>Weekend Name:</Label>
                      <Input
                        onChange={(e) => {
                          const { name, value } = e.target;
                          handleChange({
                            ...data,
                            conditional_weekends: data.conditional_weekends.map(
                              (weekend, i) =>
                                i === index
                                  ? { ...weekend, [name]: value }
                                  : weekend
                            ),
                          });
                        }}
                        type="text"
                        value={weekend.name || ""}
                        name="name"
                        placeholder="Weekend Name"
                        readOnly={isReadOnly}
                      />
                    </div>
                    <div className="lg:col-6">
                      <Label>Pattern (pipe separated):</Label>
                      <Input
                        onChange={(e) => {
                          const { name, value } = e.target;
                          handleChange({
                            ...data,
                            conditional_weekends: data.conditional_weekends.map(
                              (weekend, i) =>
                                i === index
                                  ? {
                                      ...weekend,
                                      [name]: value.split("|").map(Number),
                                    }
                                  : weekend
                            ),
                          });
                        }}
                        type="text"
                        value={weekend.pattern.join("|") || ""}
                        name="pattern"
                        placeholder="Pattern (pipe separated)"
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
                      conditional_weekends: [
                        ...data.conditional_weekends,
                        { name: "", pattern: [] },
                      ],
                    });
                  }}
                >
                  Add Conditional Weekend
                </Button>
              )}
            </div>
            {/* Leaves */}
            <div className="lg:col-12">
              <Label>Leaves:</Label>
              {data.leaves.map((leave, index) => (
                <div className="relative bg-light rounded p-5 mb-5" key={index}>
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
                      <Select
                        value={leave.name}
                        onValueChange={(value) =>
                          handleChange({
                            ...data,
                            leaves: data.leaves.map((leave, i) =>
                              i === index ? { ...leave, name: value } : leave
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
                                : leave
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
                      leaves: [...data.leaves, { name: "", days: 0 }],
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
