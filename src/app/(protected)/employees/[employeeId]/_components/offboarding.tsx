import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/shadcn";
import {
  useAddEmployeeOffboardingMutation,
  useGetEmployeeOffboardingQuery,
} from "@/redux/features/employeeOffboardingApiSlice/employeeOffboardingSlice";
import {
  TEmployeeOffboardingCreate,
  TOffboardingTask,
} from "@/redux/features/employeeOffboardingApiSlice/employeeOffboardingType";
import { ErrorResponse } from "@/types";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Offboarding() {
  const { data: session } = useSession();
  const role = session?.user.role;
  let { employeeId } = useParams<{ employeeId: string }>();
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }
  const { data, isLoading } = useGetEmployeeOffboardingQuery(employeeId);
  const [employeeOffboarding, { isLoading: isOffboardingLoading }] =
    useAddEmployeeOffboardingMutation();
  const task = data?.result ?? {};

  const [offboardingData, setOffboardingData] =
    useState<TEmployeeOffboardingCreate>({
      employee_id: "",
      resignation_date: new Date(),
    });

  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader className="border-b-transparent">
          <CardTitle>Offboarding</CardTitle>
        </CardHeader>
        <CardContent className={isLoading ? "py-20" : "pt-0 overflow-hidden"}>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin size-5" />
            </div>
          ) : data?.result ? (
            <div className="flex flex-col gap-4">
              <ul className="space-y-3">
                {Object.entries(task).map(([taskName, value]) => {
                  const taskValue = value as TOffboardingTask;
                  if (!taskValue.task_name) return null;
                  const variants = {
                    Completed: "success",
                    Pending: "warning",
                    Scheduled: "info",
                    "Not Started": "error",
                  };

                  return (
                    <li
                      key={taskName}
                      className="row mx-0 space-y-3 lg:space-y-0 lg:row-cols-3 items-center bg-light rounded py-3"
                    >
                      <div className="flex items-center">
                        <div>
                          <small className="text-xs text-muted-foreground block">
                            Course Name:
                          </small>
                          <strong className="text-h6 text-sm font-medium capitalize">
                            {taskValue.task_name}
                          </strong>
                        </div>
                      </div>
                      <div>
                        <small className="text-xs text-muted-foreground block">
                          Assign To:
                        </small>
                        <strong className="text-h6 text-sm font-medium capitalize">
                          {taskValue.assigned_to}
                        </strong>
                      </div>
                      <div>
                        <small className="text-xs text-muted-foreground block">
                          Status
                        </small>
                        <strong className="text-h6 text-sm font-medium">
                          {/* @ts-ignore */}
                          <Badge variant={variants[taskValue.status]}>
                            {taskValue.status}
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
                    <DialogHeader className="sr-only">
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
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                          <Label htmlFor="resignation_date">
                            Resignation Date
                          </Label>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"input"}
                                className={cn("w-full flex justify-between")}
                              >
                                {offboardingData.resignation_date ? (
                                  new Date(
                                    offboardingData.resignation_date
                                  ).toDateString()
                                ) : (
                                  <span>Select Date</span>
                                )}
                                <span className="flex items-center">
                                  <span
                                    className={cn(
                                      "bg-[#cccccc] mb-2 mt-2 h-5 block w-[1px]"
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
                                    resignation_date: date!,
                                  });
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex flex-col gap-4">
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
