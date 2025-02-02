import { TPagination } from "@/types";
import { toast } from "sonner";
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

    addEmployee: builder.mutation<TEmployeeState, TEmployeeCreate>({
      query: (data) => ({
        url: `/employee`,
        method: "POST",
        body: data,
      }),
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

      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Update data successfully!");
        } catch (error: any) {
          toast.error(error.message ?? "Something went wrong!");
        }
      },

      invalidatesTags: ["employees"],
    }),

    updateEmployeeEmail: builder.mutation<
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

    updateEmployeeDiscord: builder.mutation<
      TEmployeeState<TEmployee>,
      Pick<TEmployee, "id" | "discord"> & {
        token?: string;
      }
    >({
      query: (data) => {
        return {
          url: `/employee/discord/${data.id}`,
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

    updateEmployeePersonality: builder.mutation<
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
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useUpdateEmployeeEmailMutation,
  useUpdateEmployeeDiscordMutation,
  useUpdateEmployeePersonalityMutation,
  useGetEmployeeDetailsByTokenQuery,
} = employeeApi;
