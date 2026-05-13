import { TPagination } from "@/types";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import { TEmployeeBank, TEmployeeBankState } from "./employeeBankType";

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
