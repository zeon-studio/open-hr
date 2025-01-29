import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dateFormat } from "@/lib/dateFormat";
import { employeeInfoById } from "@/lib/employeeInfo";
import {
  useGetPendingOffboardingTaskQuery,
  useUpdateOffboardingTaskStatusMutation,
} from "@/redux/features/employeeOffboardingApiSlice/employeeOffboardingSlice";
import {
  useGetPendingOnboardingTaskQuery,
  useUpdateOnboardingTaskStatusMutation,
} from "@/redux/features/employeeOnboardingApiSlice/employeeOnboardingSlice";
import { TOnboardingTask } from "@/redux/features/employeeOnboardingApiSlice/employeeOnboardingType";
import { BadgeInfo, CheckCircle, CircleDashed } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

const PendingTasks = () => {
  const { data: offboardingTasks } =
    useGetPendingOffboardingTaskQuery(undefined);
  const { data: onboardingTasks } = useGetPendingOnboardingTaskQuery(undefined);
  const [updateOffboardingTask] = useUpdateOffboardingTaskStatusMutation();
  const [updateOnboardingTask] = useUpdateOnboardingTaskStatusMutation();

  const mergeTasks = useMemo(() => {
    return [
      ...(offboardingTasks?.result?.map((task) => ({
        ...task,
        type: "offboarding",
      })) || []),
      ...(onboardingTasks?.result?.map((task) => ({
        ...task,
        type: "onboarding",
      })) || []),
    ];
  }, [offboardingTasks, onboardingTasks]);

  const handleCompleteTask = async (
    employeeId: string,
    taskName: string,
    type: string
  ) => {
    try {
      if (type === "offboarding") {
        await updateOffboardingTask({
          employee_id: employeeId,
          task_name: taskName,
        }).unwrap();
      } else {
        await updateOnboardingTask({
          employee_id: employeeId,
          task_name: taskName,
        }).unwrap();
      }
      toast.success("Task marked as completed");
    } catch (error: any) {
      toast.error(error.message ?? "Failed to complete task");
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <BadgeInfo className="mr-2 inline-block" />
          Pending Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:h-[300px] scroll-box">
        {mergeTasks?.length === 0 ? (
          <p className="text-text-light">No pending tasks</p>
        ) : (
          <ul className="space-y-3">
            {mergeTasks?.map(
              (
                task: TOnboardingTask & {
                  employee_id: string;
                  createdAt: Date;
                  type: string;
                },
                index: number
              ) => (
                <li
                  className="flex items-start justify-between flex-wrap lg:flex-nowrap"
                  key={`task-${index}`}
                >
                  <div className="flex items-start">
                    <CircleDashed className="mr-2 mt-1 size-5 text-muted" />
                    <div className="flex-1">
                      <strong className="font-medium">{task.task_name}</strong>
                      <small className="block text-text-light">
                        Employee: {employeeInfoById(task.employee_id)?.name}
                      </small>
                      <small className="block text-text-light">
                        Assigned: {employeeInfoById(task.assigned_to)?.name}
                      </small>
                      <small className="block text-text-light">
                        Started: {dateFormat(task.createdAt)}
                      </small>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCompleteTask(
                        task.employee_id,
                        task.task_name!,
                        task.type
                      )
                    }
                    className="ml-2"
                  >
                    <CheckCircle className="size-4 mr-1" />
                    Complete
                  </Button>
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
