import { TPagination } from "@/types";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import { TEmployeeContact, TEmployeeContactState } from "./employeeContactType";

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
