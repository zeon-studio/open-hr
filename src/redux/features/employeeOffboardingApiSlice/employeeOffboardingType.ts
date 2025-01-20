export type TOffboardingTask = {
  task_name: string;
  assigned_to: string;
  status: string;
};

export type TEmployeeOffboarding = {
  employee_id: string;
  remove_fingerprint: TOffboardingTask;
  task_handover: TOffboardingTask;
  collect_id_card: TOffboardingTask;
  collect_email: TOffboardingTask;
  collect_devices: TOffboardingTask;
  nda_agreement: TOffboardingTask;
  provide_certificate: TOffboardingTask;
  farewell: TOffboardingTask;
  createdAt: Date;
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
  result: (TOffboardingTask & { employee_id: string; createdAt: Date })[];
};
