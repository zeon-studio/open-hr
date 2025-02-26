export type TPrevJob = {
  company_name: string;
  company_website: string;
  designation: string;
  start_date: Date;
  end_date: Date;
  job_type: "full_time" | "part_time" | "remote" | "contractual" | "internship";
};

export type TPromotion = {
  designation: string;
  promotion_date: Date;
};

export type TEmployeeJob = {
  employee_id: string;
  job_type: "full_time" | "part_time" | "remote" | "contractual" | "internship";
  manager_id: string;
  joining_date: Date;
  permanent_date: Date;
  resignation_date: Date;
  prev_jobs: TPrevJob[];
  promotions: TPromotion[];
  note: string;
  createdAt?: Date;
};

export type TEmployeeJobState<T = TEmployeeJob[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};
