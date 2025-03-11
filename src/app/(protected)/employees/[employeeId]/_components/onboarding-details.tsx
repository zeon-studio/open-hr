import { employeeInfoById } from "@/lib/employee-info";
import { useGetEmployeeOnboardingQuery } from "@/redux/features/employeeOnboardingApiSlice/employeeOnboardingSlice";
import { Badge } from "@/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function Onboarding() {
  const { data: session } = useSession();
  const params = useParams<{ employeeId: string }>();
  let employeeId = params?.employeeId ?? "";
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
          {data?.result?.tasks ? (
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
