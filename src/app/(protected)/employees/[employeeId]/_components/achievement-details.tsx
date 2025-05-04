import options from "@/config/options.json";
import { dateFormat, formatDateWithTime } from "@/lib/date-converter";
import EditFrom from "@/partials/edit-from";
import {
  useGetEmployeeAchievementQuery,
  useUpdateEmployeeAchievementMutation,
} from "@/redux/features/employeeAchievementApiSlice/employeeAchievementSlice";
import {
  TAchievement,
  TEmployeeAchievement,
} from "@/redux/features/employeeAchievementApiSlice/employeeAchievementType";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Card, CardContent } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Separator } from "@/ui/separator";
import { CalendarIcon, Loader2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Achievement() {
  const { data: session } = useSession();
  const params = useParams<{ employeeId: string }>();
  let employeeId = params?.employeeId ?? "";
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }
  const [
    addAchievement,
    { isLoading: isAddLoading, isSuccess: isAddSuccess, isError: isAddError },
  ] = useUpdateEmployeeAchievementMutation();
  const { data, isLoading } = useGetEmployeeAchievementQuery(employeeId);

  useEffect(() => {
    if (isAddSuccess) {
      toast("Achievement details updated successfully");
    } else if (isAddError) {
      toast("Failed to update Achievement details");
    }
  }, [isAddSuccess, isAddError]);

  return (
    <div>
      {isLoading ? (
        <Card>
          <CardContent className={"py-20"}>
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin size-5" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <EditFrom<TEmployeeAchievement>
            isUpdating={isAddLoading}
            data={data?.result!}
            title="Achievement Details"
            hasEditAccess={
              session?.user.role === "admin" ||
              session?.user.role === "moderator"
            }
          >
            {(props) => (
              <AchievementForm
                {...props}
                employeeId={employeeId}
                addAchievement={addAchievement}
              />
            )}
          </EditFrom>
        </div>
      )}
    </div>
  );
}

function AchievementForm({
  handleChange,
  isReadOnly,
  data,
  formRef,
  employeeId,
  addAchievement,
}: {
  handleChange: (value: TEmployeeAchievement) => void;
  isReadOnly: boolean;
  data: TEmployeeAchievement;
  formRef: React.RefObject<HTMLFormElement | null>;
  employeeId: string;
  addAchievement: any;
}) {
  // Auto-add achievement field if none exists and in edit mode
  useEffect(() => {
    if (
      !isReadOnly &&
      (!data?.achievements || data.achievements.length === 0)
    ) {
      handleChange({
        ...data,
        achievements: [
          {
            type: "award",
            description: "",
            date: new Date(),
          },
        ],
      });
    }
  }, [isReadOnly, data, handleChange]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addAchievement({
          achievements: data.achievements,
          employee_id: employeeId,
        });
      }}
      className={"space-y-4"}
      ref={formRef}
    >
      {data?.achievements.length > 0 ? (
        data?.achievements?.map((achievement, index, achievements) => {
          return (
            <div
              className={`${isReadOnly ? "bg-white" : "bg-light px-5 pt-5"} rounded relative`}
              key={index}
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
                        achievements: data.achievements.filter(
                          (achievement, i) => i !== index
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
                  <Label>Achievement Type:</Label>
                  {isReadOnly ? (
                    <small className="block capitalize">
                      {achievement.type}
                    </small>
                  ) : (
                    <Select
                      value={achievement.type}
                      onValueChange={(value) => {
                        handleChange({
                          ...data,
                          achievements: data.achievements.map(
                            (achievement, i) => {
                              if (i === index) {
                                return {
                                  ...achievement,
                                  type: value as TAchievement["type"],
                                };
                              }
                              return achievement;
                            }
                          ),
                        });
                      }}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.employee_achievement_type.map((item) => (
                          <SelectItem value={item.value} key={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="lg:col-6 mb-4">
                  <Label>Date:</Label>
                  {isReadOnly ? (
                    <small className="block">
                      {dateFormat(achievement.date)}
                    </small>
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"input"}
                          className="w-full flex justify-between"
                        >
                          {achievement.date ? (
                            dateFormat(achievement.date)
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <span className="flex items-center">
                            <span className="bg-border mb-2 mt-2 h-5 block w-[1px]"></span>
                            <span className="pl-2  block">
                              <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                            </span>
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            achievement.date
                              ? new Date(achievement.date)
                              : new Date()
                          }
                          onSelect={(date) => {
                            handleChange({
                              ...data,
                              achievements: achievements.map(
                                (achievement, i) => {
                                  if (index === i) {
                                    return {
                                      ...achievement,
                                      date: formatDateWithTime(date!),
                                    };
                                  }
                                  return achievement;
                                }
                              ),
                            });
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                <div className="lg:col-12 mb-4">
                  <Label>Description:</Label>
                  <Input
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange({
                        ...data,
                        achievements: achievements.map((achievement, i) => {
                          if (index === i) {
                            return {
                              ...achievement,
                              [name]: value,
                            };
                          }
                          return achievement;
                        }),
                      });
                    }}
                    required
                    readOnly={isReadOnly}
                    value={achievement.description}
                    name="description"
                    placeholder="Description"
                  />
                </div>
              </div>

              {isReadOnly && achievements.length - 1 !== index && (
                <Separator className="my-6 lg:col-span-2" />
              )}
            </div>
          );
        })
      ) : (
        <p className="py-4">
          No achievements available. Please add a achievement to view
        </p>
      )}
      {!isReadOnly && (
        <Button
          variant="outline"
          className="w-full mt-6"
          onClick={() => {
            handleChange({
              ...data,
              achievements: [
                ...(data?.achievements ?? []),
                {
                  type: "award",
                  description: "",
                  date: new Date(),
                },
              ],
            });
          }}
          type="button"
          disabled={isReadOnly}
        >
          Add Achievement
        </Button>
      )}
    </form>
  );
}
