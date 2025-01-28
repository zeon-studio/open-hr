import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import { TEmployeeBank, TEmployeeBankState } from "./employeeBankType";

const employeeBankApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["employee-banks"],
});

export const employeeBankApi = employeeBankApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeBanks: builder.query<TEmployeeBankState, TPagination>({
      query: ({ page, limit, search }) => ({
        url: `/employee-bank?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["employee-banks"],
      keepUnusedDataFor: 30 * 60,
    }),

    getEmployeeBank: builder.query<TEmployeeBankState<TEmployeeBank>, string>({
      query: (id) => ({
        url: `/employee-bank/${id}`,
        method: "GET",
      }),
      providesTags: ["employee-banks"],
    }),

    addEmployeeBank: builder.mutation<TEmployeeBankState, TEmployeeBank>({
      query: (data) => ({
        url: `/employee-bank`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["employee-banks"],
    }),

    updateEmployeeBank: builder.mutation<TEmployeeBankState, TEmployeeBank>({
      query: (data) => {
        return {
          url: `/employee-bank/${data.employee_id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["employee-banks"],
    }),

    deleteEmployeeBank: builder.mutation({
      query: (id) => ({
        url: `/employee-bank/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["employee-banks"],
    }),
  }),
});

export const {
  useGetEmployeeBanksQuery,
  useGetEmployeeBankQuery,
  useAddEmployeeBankMutation,
  useUpdateEmployeeBankMutation,
  useDeleteEmployeeBankMutation,
} = employeeBankApi;
