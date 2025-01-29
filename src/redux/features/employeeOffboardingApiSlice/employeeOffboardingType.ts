export type TOffboardingTask = {
  task_name: string;
  assigned_to: string;
  status: string;
};

export type TEmployeeOffboarding = {
  employee_id: string;
  tasks: TOffboardingTask[];
  createdAt?: Date;
};

export type TEmployeeOffboardingCreate = {
  employee_id: string;
  resignation_date: Date;
};

export type TEmployeeOffboardingState<T = TEmployeeOffboarding[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};

export type TAllOffboardingTaskState = {
  success: boolean;
  message: string;
  result: (TOffboardingTask & {
    employee_id: string;
    task_id: string;
    createdAt: Date;
  })[];
};
