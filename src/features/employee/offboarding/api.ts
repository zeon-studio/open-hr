import { apiRequest, createMutationHook, createQueryHook } from "@/lib/api-client";
import { TPagination } from "@/types";

export type TOffboardingTask = {
  task_name: string;
  assigned_to: string;
  status: string;
};

export type TEmployeeOffboarding = {
  employee_id: string;
  tasks: TOffboardingTask[];
  createdAt?: Date;
};

export type TEmployeeOffboardingCreate = {
  employee_id: string;
  resignation_date: Date;
};

export type TEmployeeOffboardingState<T = TEmployeeOffboarding[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};

export type TAllOffboardingTaskState = {
  success: boolean;
  message: string;
  result: (TOffboardingTask & {
    employee_id: string;
    task_id: string;
    createdAt: Date;
  })[];
};

export const useGetEmployeeOffboardingsQuery = createQueryHook<
  TEmployeeOffboardingState,
  TPagination
>(({ page, limit, search }) =>
  apiRequest<TEmployeeOffboardingState>({
    url: `/employee-offboarding?page=${page}&limit=${limit}&search=${search}`,
    method: "GET",
  }),
);

export const useGetEmployeeOffboardingQuery = createQueryHook<
  TEmployeeOffboardingState<TEmployeeOffboarding>,
  string
>((id) =>
  apiRequest<TEmployeeOffboardingState<TEmployeeOffboarding>>({
    url: `/employee-offboarding/${id}`,
    method: "GET",
  }),
);

export const useGetPendingOffboardingTaskQuery = createQueryHook<
  TAllOffboardingTaskState,
  undefined
>(() =>
  apiRequest<TAllOffboardingTaskState>({
    url: `/employee-offboarding/pending-task`,
    method: "GET",
  }),
);

export const useAddEmployeeOffboardingMutation = createMutationHook<
  TEmployeeOffboardingState,
  TEmployeeOffboardingCreate
>((data) =>
  apiRequest<TEmployeeOffboardingState>({
    url: `/employee-offboarding`,
    method: "POST",
    body: data,
  }),
);

export const useUpdateOffboardingTaskStatusMutation = createMutationHook<
  unknown,
  { employee_id: string; task_name: string }
>((data) =>
  apiRequest({
    url: `/employee-offboarding/task/${data.employee_id}/${data.task_name}`,
    method: "PATCH",
  }),
);

export const useDeleteEmployeeOffboardingMutation = createMutationHook<
  unknown,
  string
>((id) =>
  apiRequest({
    url: `/employee-offboarding/${id}`,
    method: "DELETE",
  }),
);
