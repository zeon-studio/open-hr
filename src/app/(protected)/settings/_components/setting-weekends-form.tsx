import options from "@/config/options.json";
import MultipleSelector from "@/layouts/components/ui/multiple-selector";
import EditFrom from "@/partials/edit-from";
import { TSetting } from "@/redux/features/settingApiSlice/settingType";
import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Trash2 } from "lucide-react";

interface SettingWeekendsFormProps {
  isUpdating: boolean;
  data: TSetting;
  handleSubmit: (data: TSetting) => void;
}

export default function SettingWeekendsForm({
  isUpdating,
  data,
  handleSubmit,
}: SettingWeekendsFormProps) {
  return (
    <EditFrom<TSetting> isUpdating={isUpdating} data={data} title="Weekends">
      {({ handleChange, isReadOnly, data, formRef }) => {
        return (
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(data);
            }}
            className="row gap-y-12"
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
                  className="border-border"
                />
              )}
            </div>

            {/* Conditional Weekends */}
            <div className="lg:col-12">
              {data.conditional_weekends.map((weekend, index) => (
                <div
                  key={index}
                  className={`${!isReadOnly && "p-5 bg-light relative"} ${isReadOnly && index !== 0 && "border-t border-border pt-5"} mb-5`}
                >
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
                      <Label>Condition Weekend Day:</Label>
                      {isReadOnly ? (
                        <small className="block capitalize">
                          {weekend.name}
                        </small>
                      ) : (
                        <Select
                          value={weekend.name}
                          onValueChange={(value) => {
                            handleChange({
                              ...data,
                              conditional_weekends:
                                data.conditional_weekends.map((weekend, i) =>
                                  i === index
                                    ? {
                                        ...weekend,
                                        name: value,
                                      }
                                    : weekend
                                ),
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a day" />
                          </SelectTrigger>
                          <SelectContent>
                            {options.weekend_days.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="lg:col-6">
                      <Label>Conditional Weekend Pattern:</Label>
                      {isReadOnly ? (
                        <small className="block capitalize">
                          {weekend.pattern.join(", ")}
                        </small>
                      ) : (
                        <MultipleSelector
                          value={weekend.pattern.map((weekend) => ({
                            label: weekend.toString(),
                            value: weekend.toString(),
                          }))}
                          options={options.conditional_weekend_pattern}
                          placeholder="Select pattern"
                          hidePlaceholderWhenSelected={true}
                          onChange={(value) => {
                            handleChange({
                              ...data,
                              conditional_weekends:
                                data.conditional_weekends.map((weekend, i) =>
                                  i === index
                                    ? {
                                        ...weekend,
                                        pattern: value.map((v) =>
                                          Number(v.value)
                                        ),
                                      }
                                    : weekend
                                ),
                            });
                          }}
                          className="border-border"
                        />
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
          </form>
        );
      }}
    </EditFrom>
  );
}
