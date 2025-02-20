import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import { TEmployee, TEmployeeCreate, TEmployeeState } from "./employeeType";

const employeeApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["employees"],
});

export const employeeApi = employeeApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<TEmployeeState, TPagination>({
      query: ({ page, limit, search }) => ({
        url: `/employee?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["employees"],
      keepUnusedDataFor: 30 * 60,
    }),

    getEmployeeDetailsByToken: builder.query<
      TEmployeeState<TEmployee>,
      { token: string }
    >({
      query: ({ token }) => ({
        url: `/employee/invite-token/${token}`,
        method: "GET",
      }),
      providesTags: ["employees"],
      keepUnusedDataFor: 30 * 60,
    }),

    getEmployeesBasics: builder.query<TEmployeeState, undefined>({
      query: () => ({
        url: `/employee/basics`,
        method: "GET",
      }),
      providesTags: ["employees"],
      keepUnusedDataFor: 30 * 60,
    }),

    getEmployee: builder.query<TEmployeeState<TEmployee>, string>({
      query: (id) => ({
        url: `/employee/${id}`,
        method: "GET",
      }),
      providesTags: ["employees"],
    }),

    getAdminAndMods: builder.query<TEmployeeState, undefined>({
      query: () => ({
        url: `/employee/admin-and-mods`,
        method: "GET",
      }),
      providesTags: ["employees"],
    }),

    addEmployee: builder.mutation<TEmployeeState, TEmployeeCreate>({
      query: (data) => ({
        url: `/employee`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["employees"],
    }),

    updateEmployeePassword: builder.mutation<
      TEmployeeState<TEmployee>,
      Pick<TEmployee, "id"> & {
        current_password: string;
        new_password: string;
      }
    >({
      query: (data) => {
        return {
          url: `/authentication/update-password`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["employees"],
    }),

    updateEmployee: builder.mutation<
      TEmployeeState<TEmployee>,
      TEmployee & { token?: string }
    >({
      query: (data) => {
        return {
          url: `/employee/update/${data.id}`,
          method: "PATCH",
          body: data,

          ...(data?.token && {
            headers: {
              authorization: `Bearer ${data.token}`,
            },
          }),
        };
      },

      invalidatesTags: ["employees"],
    }),

    setEmployeeEmail: builder.mutation<
      TEmployeeState<TEmployee>,
      Pick<TEmployee, "id"> & {
        email: string;
        token?: string;
      }
    >({
      query: (data) => {
        return {
          url: `/employee/email/${data.id}`,
          method: "PATCH",
          body: data,
          ...(data.token && {
            headers: {
              authorization: `Bearer ${data.token}`,
            },
          }),
        };
      },
      invalidatesTags: ["employees"],
    }),

    setEmployeePassword: builder.mutation<
      TEmployeeState<TEmployee>,
      Pick<TEmployee, "id"> & {
        password: string;
        token?: string;
      }
    >({
      query: (data) => {
        return {
          url: `/employee/password/${data.id}`,
          method: "PATCH",
          body: data,
          ...(data.token && {
            headers: {
              authorization: `Bearer ${data.token}`,
            },
          }),
        };
      },
      invalidatesTags: ["employees"],
    }),

    setEmployeeCommunicationId: builder.mutation<
      TEmployeeState<TEmployee>,
      Pick<TEmployee, "id" | "communication_id"> & {
        token?: string;
      }
    >({
      query: (data) => {
        return {
          url: `/employee/communication_id/${data.id}`,
          method: "PATCH",
          body: data,
          ...(data.token && {
            headers: {
              authorization: `Bearer ${data.token}`,
            },
          }),
        };
      },
      invalidatesTags: ["employees"],
    }),

    setEmployeePersonality: builder.mutation<
      TEmployeeState<TEmployee>,
      Pick<TEmployee, "id" | "personality"> & {
        token?: string;
      }
    >({
      query: (data) => {
        return {
          url: `/employee/personality/${data.id}`,
          method: "PATCH",
          body: data,
          ...(data.token && {
            headers: {
              authorization: `Bearer ${data.token}`,
            },
          }),
        };
      },
      invalidatesTags: ["employees"],
    }),

    updateEmployeeRole: builder.mutation<
      TEmployeeState<TEmployee>,
      Partial<TEmployee>
    >({
      query: (data) => {
        return {
          url: `/employee/role/${data.id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["employees"],
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employee/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["employees"],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeesBasicsQuery,
  useGetEmployeeQuery,
  useGetAdminAndModsQuery,
  useAddEmployeeMutation,
  useUpdateEmployeePasswordMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useSetEmployeeEmailMutation,
  useSetEmployeePasswordMutation,
  useSetEmployeeCommunicationIdMutation,
  useSetEmployeePersonalityMutation,
  useUpdateEmployeeRoleMutation,
  useGetEmployeeDetailsByTokenQuery,
} = employeeApi;
