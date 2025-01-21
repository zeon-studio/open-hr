import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import { TEmployeeJob, TEmployeeJobState } from "./employeeJobType";

const employeeJobApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["employee-jobs"],
});

export const employeeJobApi = employeeJobApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeJobs: builder.query<TEmployeeJobState, TPagination>({
      query: ({ page, limit, search }) => ({
        url: `/employee-job?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["employee-jobs"],
      keepUnusedDataFor: 30 * 60,
    }),

    getEmployeeJob: builder.query<TEmployeeJobState<TEmployeeJob>, string>({
      query: (id) => ({
        url: `/employee-job/${id}`,
        method: "GET",
      }),
      providesTags: ["employee-jobs"],
    }),

    addEmployeeJob: builder.mutation<TEmployeeJobState, TEmployeeJob>({
      query: (data) => ({
        url: `/employee-job`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["employee-jobs"],
    }),

    updateEmployeeJob: builder.mutation({
      query: (data) => {
        return {
          url: `/employee-job/${data.id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["employee-jobs"],
    }),

    deleteEmployeeJob: builder.mutation({
      query: (id) => ({
        url: `/employee-job/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["employee-jobs"],
    }),
  }),
});

export const {
  useGetEmployeeJobsQuery,
  useGetEmployeeJobQuery,
  useAddEmployeeJobMutation,
  useUpdateEmployeeJobMutation,
  useDeleteEmployeeJobMutation,
} = employeeJobApi;
