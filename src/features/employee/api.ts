import { apiRequest, createMutationHook, createQueryHook } from "@/lib/api-client";
import { TPagination } from "@/types";
import { TEmployee, TEmployeeCreate, TEmployeeState } from "@/types/employee";


const employeeAuthHeader = (token?: string) =>
  token
    ? {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    : {};

export const useGetEmployeesQuery = createQueryHook<
  TEmployeeState,
  TPagination
>(({ page, limit, search, status }) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search: String(search ?? ""),
  });

  if (status) {
    params.set("status", status);
  }

  return apiRequest<TEmployeeState>({
    url: `/employee?${params.toString()}`,
    method: "GET",
  });
},
  ["employee"],
);

export const useGetEmployeeDetailsByTokenQuery = createQueryHook<
  TEmployeeState<TEmployee>,
  { token: string }
>(({ token }) =>
  apiRequest<TEmployeeState<TEmployee>>({
    url: `/employee/invite-token/${token}`,
    method: "GET",
  }),
);

export const useGetEmployeesBasicsQueryBase = createQueryHook<
  TEmployeeState,
  undefined
>(() =>
  apiRequest<TEmployeeState>({
    url: `/employee/basics`,
    method: "GET",
  }),
  ["employee-basics"],
);

export const useGetEmployeeQuery = createQueryHook<
  TEmployeeState<TEmployee>,
  string
>((id) =>
  apiRequest<TEmployeeState<TEmployee>>({
    url: `/employee/${id}`,
    method: "GET",
  }),
  ["employee"],
);

export const useGetAdminAndModsQuery = createQueryHook<
  TEmployeeState,
  undefined
>(() =>
  apiRequest<TEmployeeState>({
    url: `/employee/admin-and-mods`,
    method: "GET",
  }),
  ["employee"],
);

export const useAddEmployeeMutation = createMutationHook<
  TEmployeeState,
  TEmployeeCreate
>((data) =>
  apiRequest<TEmployeeState>({
    url: `/employee`,
    method: "POST",
    body: data,
  }),
  { invalidatesTags: ["employee", "employee-basics"] },
);

export const useUpdateEmployeePasswordMutation = createMutationHook<
  TEmployeeState<TEmployee>,
  Pick<TEmployee, "id"> & { current_password: string; new_password: string }
>((data) =>
  apiRequest<TEmployeeState<TEmployee>>({
    url: `/authentication/update-password`,
    method: "PATCH",
    body: data,
  }),
  { invalidatesTags: ["employee", "employee-basics"] },
);

export const useUpdateEmployeeMutation = createMutationHook<
  TEmployeeState<TEmployee>,
  TEmployee & { token?: string }
>((data) =>
  apiRequest<TEmployeeState<TEmployee>>({
    url: `/employee/update/${data.id}`,
    method: "PATCH",
    body: data,
    ...employeeAuthHeader(data.token),
  }),
  { invalidatesTags: ["employee", "employee-basics"] },
);

export const useDeleteEmployeeMutation = createMutationHook<unknown, string>(
  (id) =>
    apiRequest({
      url: `/employee/${id}`,
      method: "DELETE",
    }),
  { invalidatesTags: ["employee", "employee-basics"] },
);

export const useSetEmployeeEmailMutation = createMutationHook<
  TEmployeeState<TEmployee>,
  Pick<TEmployee, "id"> & { email: string; token?: string }
>((data) =>
  apiRequest<TEmployeeState<TEmployee>>({
    url: `/employee/email/${data.id}`,
    method: "PATCH",
    body: data,
    ...employeeAuthHeader(data.token),
  }),
  { invalidatesTags: ["employee", "employee-basics"] },
);

export const useSetEmployeePasswordMutation = createMutationHook<
  TEmployeeState<TEmployee>,
  Pick<TEmployee, "id"> & { password: string; token?: string }
>((data) =>
  apiRequest<TEmployeeState<TEmployee>>({
    url: `/employee/password/${data.id}`,
    method: "PATCH",
    body: data,
    ...employeeAuthHeader(data.token),
  }),
  { invalidatesTags: ["employee", "employee-basics"] },
);

export const useSetEmployeeCommunicationIdMutation = createMutationHook<
  TEmployeeState<TEmployee>,
  Pick<TEmployee, "id" | "communication_id"> & { token?: string }
>((data) =>
  apiRequest<TEmployeeState<TEmployee>>({
    url: `/employee/communication_id/${data.id}`,
    method: "PATCH",
    body: data,
    ...employeeAuthHeader(data.token),
  }),
  { invalidatesTags: ["employee", "employee-basics"] },
);

export const useSetEmployeePersonalityMutation = createMutationHook<
  TEmployeeState<TEmployee>,
  Pick<TEmployee, "id" | "personality"> & { token?: string }
>((data) =>
  apiRequest<TEmployeeState<TEmployee>>({
    url: `/employee/personality/${data.id}`,
    method: "PATCH",
    body: data,
    ...employeeAuthHeader(data.token),
  }),
  { invalidatesTags: ["employee", "employee-basics"] },
);

export const useUpdateEmployeeRoleMutation = createMutationHook<
  TEmployeeState<TEmployee>,
  Partial<TEmployee>
>((data) =>
  apiRequest<TEmployeeState<TEmployee>>({
    url: `/employee/role/${data.id}`,
    method: "PATCH",
    body: data,
  }),
  { invalidatesTags: ["employee", "employee-basics"] },
);
