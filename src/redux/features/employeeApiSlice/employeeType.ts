export type TEmployee = {
  id: string;
  name: string;
  image: string;
  work_email: string;
  personal_email: string;
  dob: Date;
  nid: string;
  tin: string;
  phone: string;
  gender: "male" | "female";
  blood_group: "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-";
  marital_status: "married" | "unmarried" | "divorced" | "widowed";
  present_address: string;
  permanent_address: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  discord: string;
  personality: string;
  note: string;
  status: "pending" | "active" | "archived";
  role: "user" | "moderator" | "admin";
  createdAt?: Date;
};

export type TEmployeeCreate = {
  personal_email: string;
  department: "development" | "design" | "marketing" | "admin";
  job_type: "full_time" | "part_time" | "remote" | "contractual" | "internship";
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
