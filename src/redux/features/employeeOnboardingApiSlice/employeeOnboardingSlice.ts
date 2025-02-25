import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import {
  TAllOnboardingTaskState,
  TEmployeeOnboarding,
  TEmployeeOnboardingState,
} from "./employeeOnboardingType";

const employeeOnboardingApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["employee-onboardings"],
});

export const employeeOnboardingApi =
  employeeOnboardingApiWithTag.injectEndpoints({
    endpoints: (builder) => ({
      getEmployeeOnboardings: builder.query<
        TEmployeeOnboardingState,
        TPagination
      >({
        query: ({ page, limit, search }) => ({
          url: `/employee-onboarding?page=${page}&limit=${limit}&search=${search}`,
          method: "GET",
        }),
        providesTags: ["employee-onboardings"],
        keepUnusedDataFor: 30 * 60,
      }),

      getEmployeeOnboarding: builder.query<
        TEmployeeOnboardingState<TEmployeeOnboarding>,
        string
      >({
        query: (id) => ({
          url: `/employee-onboarding/${id}`,
          method: "GET",
        }),
        providesTags: ["employee-onboardings"],
      }),

      getPendingOnboardingTask: builder.query<
        TAllOnboardingTaskState,
        undefined
      >({
        query: () => ({
          url: `/employee-onboarding/pending-task`,
          method: "GET",
        }),
        providesTags: ["employee-onboardings"],
        keepUnusedDataFor: 30 * 60,
      }),

      addEmployeeOnboarding: builder.mutation<
        TEmployeeOnboardingState,
        TEmployeeOnboarding
      >({
        query: (data) => ({
          url: `/employee-onboarding`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["employee-onboardings"],
      }),

      updateOnboardingTaskStatus: builder.mutation({
        query: (data) => {
          return {
            url: `/employee-onboarding/task/${data.employee_id}/${data.task_name}`,
            method: "PATCH",
          };
        },
        invalidatesTags: ["employee-onboardings"],
      }),

      deleteEmployeeOnboarding: builder.mutation({
        query: (id) => ({
          url: `/employee-onboarding/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["employee-onboardings"],
      }),
    }),
  });

export const {
  useGetEmployeeOnboardingsQuery,
  useGetEmployeeOnboardingQuery,
  useAddEmployeeOnboardingMutation,
  useGetPendingOnboardingTaskQuery,
  useUpdateOnboardingTaskStatusMutation,
  useDeleteEmployeeOnboardingMutation,
} = employeeOnboardingApi;
