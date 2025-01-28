import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import {
  TEmployeeEducation,
  TEmployeeEducationState,
} from "./employeeEducationType";

const employeeEducationApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["employee-educations"],
});

export const employeeEducationApi = employeeEducationApiWithTag.injectEndpoints(
  {
    endpoints: (builder) => ({
      getEmployeeEducations: builder.query<
        TEmployeeEducationState,
        TPagination
      >({
        query: ({ page, limit, search }) => ({
          url: `/employee-education?page=${page}&limit=${limit}&search=${search}`,
          method: "GET",
        }),
        providesTags: ["employee-educations"],
        keepUnusedDataFor: 30 * 60,
      }),

      getEmployeeEducation: builder.query<
        TEmployeeEducationState<TEmployeeEducation>,
        string
      >({
        query: (id) => ({
          url: `/employee-education/${id}`,
          method: "GET",
        }),
        providesTags: ["employee-educations"],
      }),

      addEmployeeEducation: builder.mutation<
        TEmployeeEducationState,
        TEmployeeEducation
      >({
        query: (data) => ({
          url: `/employee-education`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["employee-educations"],
      }),

      updateEmployeeEducation: builder.mutation<
        TEmployeeEducationState,
        TEmployeeEducation
      >({
        query: (data) => {
          return {
            url: `/employee-education/${data.employee_id}`,
            method: "PATCH",
            body: data,
          };
        },
        invalidatesTags: ["employee-educations"],
      }),

      deleteEmployeeEducation: builder.mutation({
        query: (id) => ({
          url: `/employee-education/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["employee-educations"],
      }),
    }),
  }
);

export const {
  useGetEmployeeEducationsQuery,
  useGetEmployeeEducationQuery,
  useAddEmployeeEducationMutation,
  useUpdateEmployeeEducationMutation,
  useDeleteEmployeeEducationMutation,
} = employeeEducationApi;
