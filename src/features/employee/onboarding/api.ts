import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "@/features/employee/api";
import { TPagination } from "@/types";

export type TOnboardingTask = {
  task_name: string;
  assigned_to: string;
  status: string;
};

export type TEmployeeOnboarding = {
  employee_id: string;
  tasks: TOnboardingTask[];
  createdAt?: Date;
};

export type TEmployeeOnboardingState<T = TEmployeeOnboarding[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};

export type TAllOnboardingTaskState = {
  success: boolean;
  message: string;
  result: (TOnboardingTask & {
    employee_id: string;
    task_id: string;
    createdAt: Date;
  })[];
};

export const useGetEmployeeOnboardingsQuery = createQueryHook<
  TEmployeeOnboardingState,
  TPagination
>(({ page, limit, search }) =>
  apiRequest<TEmployeeOnboardingState>({
    url: `/employee-onboarding?page=${page}&limit=${limit}&search=${search}`,
    method: "GET",
  }),
);

export const useGetEmployeeOnboardingQuery = createQueryHook<
  TEmployeeOnboardingState<TEmployeeOnboarding>,
  string
>((id) =>
  apiRequest<TEmployeeOnboardingState<TEmployeeOnboarding>>({
    url: `/employee-onboarding/${id}`,
    method: "GET",
  }),
);

export const useGetPendingOnboardingTaskQuery = createQueryHook<
  TAllOnboardingTaskState,
  undefined
>(() =>
  apiRequest<TAllOnboardingTaskState>({
    url: `/employee-onboarding/pending-task`,
    method: "GET",
  }),
);

export const useAddEmployeeOnboardingMutation = createMutationHook<
  TEmployeeOnboardingState,
  TEmployeeOnboarding
>((data) =>
  apiRequest<TEmployeeOnboardingState>({
    url: `/employee-onboarding`,
    method: "POST",
    body: data,
  }),
);

export const useUpdateOnboardingTaskStatusMutation = createMutationHook<
  unknown,
  { employee_id: string; task_name: string }
>((data) =>
  apiRequest({
    url: `/employee-onboarding/task/${data.employee_id}/${data.task_name}`,
    method: "PATCH",
  }),
);

export const useDeleteEmployeeOnboardingMutation = createMutationHook<
  unknown,
  string
>((id) =>
  apiRequest({
    url: `/employee-onboarding/${id}`,
    method: "DELETE",
  }),
);
