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
