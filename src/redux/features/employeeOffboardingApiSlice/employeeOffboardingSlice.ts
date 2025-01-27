import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import {
  TAllOffboardingTaskState,
  TEmployeeOffboarding,
  TEmployeeOffboardingCreate,
  TEmployeeOffboardingState,
} from "./employeeOffboardingType";

const employeeOffboardingApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["employee-offboardings"],
});

export const employeeOffboardingApi =
  employeeOffboardingApiWithTag.injectEndpoints({
    endpoints: (builder) => ({
      getEmployeeOffboardings: builder.query<
        TEmployeeOffboardingState,
        TPagination
      >({
        query: ({ page, limit, search }) => ({
          url: `/employee-offboarding?page=${page}&limit=${limit}&search=${search}`,
          method: "GET",
        }),
        providesTags: ["employee-offboardings"],
        keepUnusedDataFor: 30 * 60,
      }),

      getEmployeeOffboarding: builder.query<
        TEmployeeOffboardingState<TEmployeeOffboarding>,
        string
      >({
        query: (id) => ({
          url: `/employee-offboarding/${id}`,
          method: "GET",
        }),
        providesTags: ["employee-offboardings"],
      }),

      getPendingOffboardingTask: builder.query<
        TAllOffboardingTaskState,
        undefined
      >({
        query: () => ({
          url: `/employee-offboarding/pending-task`,
          method: "GET",
        }),
        providesTags: ["employee-offboardings"],
        keepUnusedDataFor: 30 * 60,
      }),

      addEmployeeOffboarding: builder.mutation<
        TEmployeeOffboardingState,
        TEmployeeOffboardingCreate
      >({
        query: (data) => ({
          url: `/employee-offboarding`,
          method: "POST",
          body: data,
        }),

        invalidatesTags: ["employee-offboardings"],
      }),

      updateEmployeeOffboarding: builder.mutation({
        query: (data) => {
          return {
            url: `/employee-offboarding/${data.id}`,
            method: "PATCH",
            body: data,
          };
        },
        invalidatesTags: ["employee-offboardings"],
      }),

      updateOffboardingTaskStatus: builder.mutation({
        query: (data) => {
          return {
            url: `/employee-offboarding/task/${data.employee_id}/${data.task}`,
            method: "PATCH",
          };
        },
        invalidatesTags: ["employee-offboardings"],
      }),

      deleteEmployeeOffboarding: builder.mutation({
        query: (id) => ({
          url: `/employee-offboarding/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["employee-offboardings"],
      }),
    }),
  });

export const {
  useGetEmployeeOffboardingsQuery,
  useGetEmployeeOffboardingQuery,
  useGetPendingOffboardingTaskQuery,
  useAddEmployeeOffboardingMutation,
  useUpdateEmployeeOffboardingMutation,
  useUpdateOffboardingTaskStatusMutation,
  useDeleteEmployeeOffboardingMutation,
} = employeeOffboardingApi;
