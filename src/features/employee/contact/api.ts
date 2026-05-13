import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "@/features/employee";
import { TPagination } from "@/types";

export type TContact = {
  name: string;
  relation: string;
  phone: string;
};

export type TEmployeeContact = {
  employee_id: string;
  contacts: TContact[];
  createdAt?: Date;
};

export type TEmployeeContactState<T = TEmployeeContact[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};

export const useGetEmployeeContactsQuery = createQueryHook<
  TEmployeeContactState,
  TPagination
>(({ page, limit, search }) =>
  apiRequest<TEmployeeContactState>({
    url: `/employee-contact?page=${page}&limit=${limit}&search=${search}`,
    method: "GET",
  }),
);

export const useGetEmployeeContactQuery = createQueryHook<
  TEmployeeContactState<TEmployeeContact>,
  string
>((id) =>
  apiRequest<TEmployeeContactState<TEmployeeContact>>({
    url: `/employee-contact/${id}`,
    method: "GET",
  }),
);

export const useUpdateEmployeeContactMutation = createMutationHook<
  unknown,
  any
>((data) =>
  apiRequest({
    url: `/employee-contact/${data.employee_id}`,
    method: "PATCH",
    body: data,
  }),
);

export const useDeleteEmployeeContactMutation = createMutationHook<
  unknown,
  string
>((id) =>
  apiRequest({
    url: `/employee-contact/${id}`,
    method: "DELETE",
  }),
);
