import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import { TEmployee, TEmployeeState } from "./employeeType";

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

    getEmployeesId: builder.query<TEmployeeState, undefined>({
      query: () => ({
        url: `/employee/id`,
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

    addEmployee: builder.mutation<TEmployeeState, TEmployee>({
      query: (data) => ({
        url: `/employee`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["employees"],
    }),

    updateEmployee: builder.mutation({
      query: (data) => {
        return {
          url: `/employee/update/${data.id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["employees"],
    }),

    updateEmployeeEmail: builder.mutation({
      query: (data) => {
        return {
          url: `/employee/email/${data.id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["employees"],
    }),

    updateEmployeeDiscord: builder.mutation({
      query: (data) => {
        return {
          url: `/employee/discord/${data.id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["employees"],
    }),

    updateEmployeePersonality: builder.mutation({
      query: (data) => {
        return {
          url: `/employee/personality/${data.id}`,
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
  useGetEmployeesIdQuery,
  useGetEmployeeQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useUpdateEmployeeEmailMutation,
  useUpdateEmployeeDiscordMutation,
  useUpdateEmployeePersonalityMutation,
} = employeeApi;
