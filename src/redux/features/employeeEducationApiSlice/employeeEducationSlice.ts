import { TPagination } from "@/types";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import {
  TEmployeeEducation,
  TEmployeeEducationState,
} from "./employeeEducationType";

export const useGetEmployeeEducationsQuery = createQueryHook<
  TEmployeeEducationState,
  TPagination
>(({ page, limit, search }) =>
  apiRequest<TEmployeeEducationState>({
    url: `/employee-education?page=${page}&limit=${limit}&search=${search}`,
    method: "GET",
  }),
);

export const useGetEmployeeEducationQuery = createQueryHook<
  TEmployeeEducationState<TEmployeeEducation>,
  string
>((id) =>
  apiRequest<TEmployeeEducationState<TEmployeeEducation>>({
    url: `/employee-education/${id}`,
    method: "GET",
  }),
);

export const useAddEmployeeEducationMutation = createMutationHook<
  TEmployeeEducationState,
  TEmployeeEducation
>((data) =>
  apiRequest<TEmployeeEducationState>({
    url: `/employee-education`,
    method: "POST",
    body: data,
  }),
);

export const useUpdateEmployeeEducationMutation = createMutationHook<
  TEmployeeEducationState,
  TEmployeeEducation
>((data) =>
  apiRequest<TEmployeeEducationState>({
    url: `/employee-education/${data.employee_id}`,
    method: "PATCH",
    body: data,
  }),
);

export const useDeleteEmployeeEducationMutation = createMutationHook<
  unknown,
  string
>((id) =>
  apiRequest({
    url: `/employee-education/${id}`,
    method: "DELETE",
  }),
);
