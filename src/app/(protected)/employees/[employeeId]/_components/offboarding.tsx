import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetEmployeeOffboardingQuery } from "@/redux/features/employeeOffboardingApiSlice/employeeOffboardingSlice";
import { TOffboardingTask } from "@/redux/features/employeeOffboardingApiSlice/employeeOffboardingType";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function Offboarding() {
  const { data: session } = useSession();
  let { employeeId } = useParams<{ employeeId: string }>();
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }
  const { data, isLoading } = useGetEmployeeOffboardingQuery(employeeId);
  const task = data?.result ?? {};

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
                          {taskValue.assigned_to}
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
              <p className="text-center text-muted-foreground py-20">
                No tasks assigned.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
