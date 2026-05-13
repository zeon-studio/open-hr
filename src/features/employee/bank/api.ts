import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "@/features/employee";
import { TPagination } from "@/types";

export type TBank = {
  bank_name: string;
  bank_ac_name: string;
  bank_ac_no: string;
  bank_district: string;
  bank_branch: string;
  bank_routing_no: string;
};

export type TEmployeeBank = {
  employee_id: string;
  banks: TBank[];
  createdAt?: Date;
};

export type TEmployeeBankState<T = TEmployeeBank[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};

export const useGetEmployeeBanksQuery = createQueryHook<
  TEmployeeBankState,
  TPagination
>(({ page, limit, search }) =>
  apiRequest<TEmployeeBankState>({
    url: `/employee-bank?page=${page}&limit=${limit}&search=${search}`,
    method: "GET",
  }),
);

export const useGetEmployeeBankQuery = createQueryHook<
  TEmployeeBankState<TEmployeeBank>,
  string
>((id) =>
  apiRequest<TEmployeeBankState<TEmployeeBank>>({
    url: `/employee-bank/${id}`,
    method: "GET",
  }),
);

export const useAddEmployeeBankMutation = createMutationHook<
  TEmployeeBankState,
  TEmployeeBank
>((data) =>
  apiRequest<TEmployeeBankState>({
    url: `/employee-bank`,
    method: "POST",
    body: data,
  }),
);

export const useUpdateEmployeeBankMutation = createMutationHook<
  TEmployeeBankState,
  TEmployeeBank
>((data) =>
  apiRequest<TEmployeeBankState>({
    url: `/employee-bank/${data.employee_id}`,
    method: "PATCH",
    body: data,
  }),
);

export const useDeleteEmployeeBankMutation = createMutationHook<
  unknown,
  string
>((id) =>
  apiRequest({
    url: `/employee-bank/${id}`,
    method: "DELETE",
  }),
);
