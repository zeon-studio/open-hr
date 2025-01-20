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
          url: `/employee/${data.id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["employees"],
    }),

    updateEmployeeNote: builder.mutation({
      query: (data) => {
        return {
          url: `/employee/update-note/${data.id}`,
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
  useUpdateEmployeeNoteMutation,
} = employeeApi;
