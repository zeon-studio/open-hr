import { TPagination } from "@/types";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import { TCreateMonthlySalary, TPayroll, TPayrollState } from "./payrollType";

const authHeader = (token?: string) =>
  token
    ? {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    : {};

export const useGetPayrollsQuery = createQueryHook<TPayrollState, TPagination>(
  ({ page, limit, search }) =>
    apiRequest<TPayrollState>({
      url: `/payroll?page=${page}&limit=${limit}&search=${search}`,
      method: "GET",
    }),
);

export const useGetPayrollBasicsQuery = createQueryHook<
  TPayrollState,
  undefined
>(() =>
  apiRequest<TPayrollState>({
    url: `/payroll/basics`,
    method: "GET",
  }),
);

export const useGetPayrollQuery = createQueryHook<
  TPayrollState<TPayroll>,
  string
>((id) =>
  apiRequest<TPayrollState<TPayroll>>({
    url: `/payroll/${id}`,
    method: "GET",
  }),
);

export const useAddMonthlyPayrollMutation = createMutationHook<
  TPayrollState,
  TCreateMonthlySalary
>((data) =>
  apiRequest<TPayrollState>({
    url: `/payroll`,
    method: "POST",
    body: data,
  }),
);

export const useUpdatePayrollMutation = createMutationHook<
  TPayrollState<TPayroll>,
  TPayroll & { token?: string }
>((data) =>
  apiRequest<TPayrollState<TPayroll>>({
    url: `/payroll/${data.employee_id}`,
    method: "PATCH",
    body: data,
    ...authHeader(data.token),
  }),
);

export const useDeletePayrollMutation = createMutationHook<unknown, string>(
  (id) =>
    apiRequest({
      url: `/payroll/${id}`,
      method: "DELETE",
    }),
);
