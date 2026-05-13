import { TPagination } from "@/types";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import {
  TEmployeeAchievement,
  TEmployeeAchievementState,
} from "./employeeAchievementType";

export const useGetEmployeeAchievementsQuery = createQueryHook<
  TEmployeeAchievementState,
  TPagination
>(({ page, limit, search }) =>
  apiRequest<TEmployeeAchievementState>({
    url: `/employee-achievement?page=${page}&limit=${limit}&search=${search}`,
    method: "GET",
  }),
);

export const useGetEmployeeAchievementQuery = createQueryHook<
  TEmployeeAchievementState<TEmployeeAchievement>,
  string
>((id) =>
  apiRequest<TEmployeeAchievementState<TEmployeeAchievement>>({
    url: `/employee-achievement/${id}`,
    method: "GET",
  }),
);

export const useUpdateEmployeeAchievementMutation = createMutationHook<
  unknown,
  any
>((data) =>
  apiRequest({
    url: `/employee-achievement/${data.employee_id}`,
    method: "PATCH",
    body: data,
  }),
);

export const useDeleteEmployeeAchievementMutation = createMutationHook<
  unknown,
  string
>((id) =>
  apiRequest({
    url: `/employee-achievement/${id}`,
    method: "DELETE",
  }),
);
