import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { employeeInfoById } from "@/lib/employeeInfo";
import { useGetEmployeeOnboardingQuery } from "@/redux/features/employeeOnboardingApiSlice/employeeOnboardingSlice";
import { TOnboardingTask } from "@/redux/features/employeeOnboardingApiSlice/employeeOnboardingType";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function Onboarding() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { isLoading, data } = useGetEmployeeOnboardingQuery(employeeId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className={"py-20"}>
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin size-5" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h5 className="mb-4">Onboarding</h5>
      <Card>
        <CardContent>
          {data?.result ? (
            <div className="flex flex-col gap-4">
              <ul className="space-y-3">
                {Object.entries(data.result).map(([taskName, value]) => {
                  const taskValue = value as TOnboardingTask;
                  if (!taskValue.task_name) return null;
                  const variants = {
                    completed: "success",
                    pending: "warning",
                    scheduled: "info",
                    "not started": "error",
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
                          <strong className="text-h6 font-medium capitalize">
                            {taskValue.task_name}
                          </strong>
                        </div>
                      </div>
                      <div>
                        <small className="text-xs text-muted-foreground block">
                          Assign To:
                        </small>
                        <strong className="text-h6 font-medium capitalize">
                          {employeeInfoById(taskValue.assigned_to).name}
                        </strong>
                      </div>
                      <div>
                        <small className="text-xs text-muted-foreground block">
                          Status
                        </small>
                        <strong className="text-h6 font-medium">
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
              <p className="text-center text-muted-foreground"></p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
