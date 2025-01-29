import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { employeeInfoById } from "@/lib/employeeInfo";
import { useGetEmployeeOnboardingQuery } from "@/redux/features/employeeOnboardingApiSlice/employeeOnboardingSlice";
import { TOnboardingTask } from "@/redux/features/employeeOnboardingApiSlice/employeeOnboardingType";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function Onboarding() {
  const { data: session } = useSession();
  let { employeeId } = useParams<{ employeeId: string }>();
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }
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
      <Card>
        <CardHeader className="border-b-transparent pb-0">
          <CardTitle>Onboarding</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
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
                          {employeeInfoById(taskValue.assigned_to).name}
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
