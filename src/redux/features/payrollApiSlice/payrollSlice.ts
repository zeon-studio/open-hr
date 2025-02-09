import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import { TCreateMonthlySalary, TPayroll, TPayrollState } from "./payrollType";

const payrollApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["payroll"],
});

export const payrollApi = payrollApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getPayrolls: builder.query<TPayrollState, TPagination>({
      query: ({ page, limit, search }) => ({
        url: `/payroll?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["payroll"],
      keepUnusedDataFor: 30 * 60,
    }),

    getPayrollBasics: builder.query<TPayrollState, undefined>({
      query: () => ({
        url: `/payroll/basics`,
        method: "GET",
      }),
      providesTags: ["payroll"],
      keepUnusedDataFor: 30 * 60,
    }),

    getPayroll: builder.query<TPayrollState<TPayroll>, string>({
      query: (id) => ({
        url: `/payroll/${id}`,
        method: "GET",
      }),
      providesTags: ["payroll"],
    }),

    addMonthlyPayroll: builder.mutation<TPayrollState, TCreateMonthlySalary>({
      query: (data) => ({
        url: `/payroll`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["payroll"],
    }),

    updatePayroll: builder.mutation<
      TPayrollState<TPayroll>,
      TPayroll & { token?: string }
    >({
      query: (data) => {
        return {
          url: `/payroll/${data.employee_id}`,
          method: "PATCH",
          body: data,

          ...(data?.token && {
            headers: {
              authorization: `Bearer ${data.token}`,
            },
          }),
        };
      },
      invalidatesTags: ["payroll"],
    }),

    deletePayroll: builder.mutation({
      query: (id) => ({
        url: `/payroll/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["payroll"],
    }),
  }),
});

export const {
  useGetPayrollsQuery,
  useGetPayrollBasicsQuery,
  useGetPayrollQuery,
  useAddMonthlyPayrollMutation,
  useUpdatePayrollMutation,
  useDeletePayrollMutation,
} = payrollApi;
