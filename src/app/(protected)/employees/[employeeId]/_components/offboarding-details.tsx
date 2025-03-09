import { dateFormat, formatDateWithTime } from "@/lib/date-converter";
import { employeeInfoById } from "@/lib/employee-info";
import { cn } from "@/lib/shadcn";
import {
  useAddEmployeeOffboardingMutation,
  useGetEmployeeOffboardingQuery,
} from "@/redux/features/employeeOffboardingApiSlice/employeeOffboardingSlice";
import { TEmployeeOffboardingCreate } from "@/redux/features/employeeOffboardingApiSlice/employeeOffboardingType";
import { ErrorResponse } from "@/types";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Label } from "@/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Offboarding() {
  const { data: session } = useSession();
  const role = session?.user.role;
  const params = useParams<{ employeeId: string }>();
  let employeeId = params?.employeeId ?? "";
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }
  const { data, isLoading } = useGetEmployeeOffboardingQuery(employeeId);
  const [employeeOffboarding, { isLoading: isOffboardingLoading }] =
    useAddEmployeeOffboardingMutation();

  const [offboardingData, setOffboardingData] =
    useState<TEmployeeOffboardingCreate>({
      employee_id: "",
      resignation_date: new Date(),
    });

  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader className="border-b-transparent pb-0">
          <CardTitle>Offboarding</CardTitle>
          {!data?.result && (
            <CardDescription>Start the offboarding process</CardDescription>
          )}
        </CardHeader>
        <CardContent className={isLoading ? "py-20" : "pt-6 overflow-hidden"}>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin size-5" />
            </div>
          ) : data?.result?.tasks ? (
            <div className="flex flex-col gap-4">
              <ul className="space-y-3">
                {data.result.tasks.map((task, index) => {
                  const variants: {
                    [key: string]:
                      | "success"
                      | "warning"
                      | "default"
                      | "destructive";
                  } = {
                    completed: "success",
                    pending: "warning",
                  };

                  return (
                    <li
                      key={`task-${index}`}
                      className="row !mx-0 space-y-3 lg:space-y-0 lg:row-cols-3 items-center bg-light rounded py-3"
                    >
                      <div className="flex items-center">
                        <div>
                          <small className="text-xs text-muted-foreground block">
                            Course Name:
                          </small>
                          <strong className="text-sm font-medium capitalize">
                            {task.task_name}
                          </strong>
                        </div>
                      </div>
                      <div>
                        <small className="text-xs text-muted-foreground block">
                          Assign To:
                        </small>
                        <strong className="text-sm font-medium capitalize">
                          {employeeInfoById(task.assigned_to).name}
                        </strong>
                      </div>
                      <div>
                        <small className="text-xs text-muted-foreground block">
                          Status
                        </small>
                        <strong className="text-sm font-medium">
                          <Badge variant={variants[task.status]}>
                            {task.status}
                          </Badge>
                        </strong>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <>
              {role === "user" ? (
                <div>
                  <p>No offboarding tasks have been assigned to you.</p>
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Initiate Off-boarding</Button>
                  </DialogTrigger>
                  <DialogContent className="overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        Initiate Off-boarding for Employee
                      </DialogTitle>
                    </DialogHeader>

                    <form
                      onSubmit={async (e) => {
                        try {
                          e.preventDefault();
                          await employeeOffboarding({
                            employee_id: employeeId,
                            resignation_date: new Date(),
                          }).unwrap();
                          toast.success("Off-boarding initiated successfully");
                        } catch (error) {
                          const errorMessage =
                            (error as ErrorResponse).data.message ||
                            "Something went wrong";
                          toast.error(errorMessage);
                        }
                      }}
                      className="pt-4"
                    >
                      <div className="space-y-5">
                        <div>
                          <Label htmlFor="resignation_date">
                            Resignation Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"input"}
                                className={cn(
                                  "w-full flex justify-between borer border-border"
                                )}
                              >
                                {offboardingData.resignation_date ? (
                                  dateFormat(offboardingData.resignation_date)
                                ) : (
                                  <span>Select Date</span>
                                )}
                                <span className="flex items-center">
                                  <span
                                    className={cn(
                                      "bg-light mb-2 mt-2 h-5 block w-[1px]"
                                    )}
                                  ></span>
                                  <span className={cn("pl-2  block")}>
                                    <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                                  </span>
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={new Date()}
                                onSelect={(date) => {
                                  setOffboardingData({
                                    ...offboardingData,
                                    resignation_date: formatDateWithTime(date!),
                                  });
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex flex-col justify-center gap-4">
                          <Button type="submit" disabled={isOffboardingLoading}>
                            Initiate Off-boarding
                          </Button>
                        </div>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
