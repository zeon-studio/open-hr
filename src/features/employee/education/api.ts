import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "@/features/employee";
import { TPagination } from "@/types";

export type TEducation = {
  degree: string;
  institute: string;
  passing_year: number;
  result: number;
  result_type: "gpa" | "cgpa" | "percentage";
  major: string;
};

export type TEmployeeEducation = {
  employee_id: string;
  educations: TEducation[];
  createdAt?: Date;
};

export type TEmployeeEducationState<T = TEmployeeEducation[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};

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
