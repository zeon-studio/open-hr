import { TPagination } from "@/types";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import {
  TAllOnboardingTaskState,
  TEmployeeOnboarding,
  TEmployeeOnboardingState,
} from "./employeeOnboardingType";

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
