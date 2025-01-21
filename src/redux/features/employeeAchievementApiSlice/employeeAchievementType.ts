export type TAchievement = {
  name: string;
  type: string;
  date: Date;
};

export type TEmployeeAchievement = {
  employee_id: string;
  achievements: TAchievement[];
  createdAt: Date;
};

export type TEmployeeAchievementState<T = TEmployeeAchievement[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};
