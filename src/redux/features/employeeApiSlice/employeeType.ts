export type TEmployee = {
  id: string;
  name: string;
  image: string;
  work_email: string;
  password: string;
  personal_email: string;
  communication_id: string;
  dob: Date;
  nid: string;
  tin: string;
  phone: string;
  gender: "male" | "female";
  blood_group: "o+" | "o-" | "a+" | "a-" | "b+" | "b-" | "ab+" | "ab-";
  marital_status: "married" | "unmarried" | "divorced" | "widowed";
  present_address: string;
  department:
    | "development"
    | "design"
    | "marketing"
    | "admin"
    | "hr_finance"
    | "production"
    | "other";
  designation: string;
  permanent_address: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  personality: string;
  note: string;
  status: "pending" | "active" | "archived";
  role: "user" | "moderator" | "admin" | "former";
  createdAt?: Date;
};

export type TEmployeePasswordUpdate = {
  id: string;
  current_password: string;
  new_password: string;
};

export type TEmployeeCreate = {
  personal_email: string;
  department:
    | "development"
    | "design"
    | "marketing"
    | "admin"
    | "hr_finance"
    | "production"
    | "other";
  job_type: "full_time" | "part_time" | "remote" | "contractual" | "internship";
  gross_salary: number;
  joining_date: Date;
  designation: string;
  manager_id: string;
};

export type TEmployeeState<T = TEmployee[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};
