import { TPagination } from "@/types";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import {
  TAllOffboardingTaskState,
  TEmployeeOffboarding,
  TEmployeeOffboardingCreate,
  TEmployeeOffboardingState,
} from "./employeeOffboardingType";

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
