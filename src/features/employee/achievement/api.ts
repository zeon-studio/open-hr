import { apiRequest, createMutationHook, createQueryHook } from "@/lib/api-client";
import { TPagination } from "@/types";

export enum EAchievementType {
  AWARD = "award",
  RECOGNITION = "recognition",
  CERTIFICATE = "certificate",
  COURSE = "course",
  TRAINING = "training",
  OTHER = "other",
}

export type TAchievement = {
  type:
    | "award"
    | "recognition"
    | "certificate"
    | "course"
    | "training"
    | "other";
  description: string;
  date: Date;
};

export type TEmployeeAchievement = {
  employee_id: string;
  achievements: TAchievement[];
  createdAt?: Date;
};

export type TEmployeeAchievementState<T = TEmployeeAchievement[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};

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
