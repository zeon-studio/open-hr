import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dateFormat } from "@/lib/dateFormat";
import { getEmployeeInfo } from "@/lib/employeeId2Info";
import { useGetPendingOffboardingTaskQuery } from "@/redux/features/employeeOffboardingApiSlice/employeeOffboardingSlice";
import { useGetPendingOnboardingTaskQuery } from "@/redux/features/employeeOnboardingApiSlice/employeeOnboardingSlice";
import { TOnboardingTask } from "@/redux/features/employeeOnboardingApiSlice/employeeOnboardingType";
import { BadgeInfo, CircleDashed } from "lucide-react";
import { useMemo } from "react";

const PendingTasks = () => {
  const { data: offboardingTasks } =
    useGetPendingOffboardingTaskQuery(undefined);
  const { data: onboardingTasks } = useGetPendingOnboardingTaskQuery(undefined);

  // today leave
  const mergeTasks = useMemo(() => {
    return [
      ...(offboardingTasks?.result || []),
      ...(onboardingTasks?.result || []),
    ];
  }, [offboardingTasks, onboardingTasks]);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <BadgeInfo className="mr-2 inline-block" />
          Pending Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] scroll-box">
        {mergeTasks?.length === 0 ? (
          <p className="text-text-light">No pending tasks</p>
        ) : (
          <ul className="space-y-3">
            {mergeTasks?.map(
              (
                task: TOnboardingTask & {
                  employee_id: string;
                  createdAt: Date;
                },
                index: number
              ) => (
                <li className="flex items-start" key={`task-${index}`}>
                  <CircleDashed className="mr-2 mt-1 size-5 text-muted" />
                  <div className="flex-1">
                    <strong>{task.task_name}</strong>
                    <small className="block text-text-light">
                      Employee: {getEmployeeInfo(task.employee_id)?.name}
                    </small>
                    <small className="block text-text-light">
                      Assigned: {getEmployeeInfo(task.assigned_to)?.name}
                    </small>
                    <small className="block text-text-light">
                      Started: {dateFormat(task.createdAt)}
                    </small>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingTasks;
