export type TOnboardingTask = {
  task_name: string;
  assigned_to: string;
  status: string;
};

export type TEmployeeOnboarding = {
  employee_id: string;
  add_fingerprint: TOnboardingTask;
  provide_id_card: TOnboardingTask;
  provide_appointment_letter: TOnboardingTask;
  provide_employment_contract: TOnboardingTask;
  provide_welcome_kit: TOnboardingTask;
  provide_devices: TOnboardingTask;
  provide_office_intro: TOnboardingTask;
  createdAt?: Date;
};

export type TEmployeeOnboardingState<T = TEmployeeOnboarding[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};

export type TAllOnboardingTaskState = {
  success: boolean;
  message: string;
  result: (TOnboardingTask & {
    employee_id: string;
    task_id: string;
    createdAt: Date;
  })[];
};
