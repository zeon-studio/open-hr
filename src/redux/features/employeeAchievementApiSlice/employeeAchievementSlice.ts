import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import {
  TEmployeeAchievement,
  TEmployeeAchievementState,
} from "./employeeAchievementType";

const employeeAchievementApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["employee-achievements"],
});

export const employeeAchievementApi =
  employeeAchievementApiWithTag.injectEndpoints({
    endpoints: (builder) => ({
      getEmployeeAchievements: builder.query<
        TEmployeeAchievementState,
        TPagination
      >({
        query: ({ page, limit, search }) => ({
          url: `/employee-achievement?page=${page}&limit=${limit}&search=${search}`,
          method: "GET",
        }),
        providesTags: ["employee-achievements"],
        keepUnusedDataFor: 30 * 60,
      }),

      getEmployeeAchievement: builder.query<
        TEmployeeAchievementState<TEmployeeAchievement>,
        string
      >({
        query: (id) => ({
          url: `/employee-achievement/${id}`,
          method: "GET",
        }),
        providesTags: ["employee-achievements"],
      }),

      updateEmployeeAchievement: builder.mutation({
        query: (data) => {
          return {
            url: `/employee-achievement/${data.employee_id}`,
            method: "PATCH",
            body: data,
          };
        },
        invalidatesTags: ["employee-achievements"],
      }),

      deleteEmployeeAchievement: builder.mutation({
        query: (id) => ({
          url: `/employee-achievement/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["employee-achievements"],
      }),
    }),
  });

export const {
  useGetEmployeeAchievementsQuery,
  useGetEmployeeAchievementQuery,
  useUpdateEmployeeAchievementMutation,
  useDeleteEmployeeAchievementMutation,
} = employeeAchievementApi;
