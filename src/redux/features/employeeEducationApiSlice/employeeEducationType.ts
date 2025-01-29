export type TEducation = {
  degree: string;
  institute: string;
  passing_year: number;
  result: number;
  result_type: "gpa" | "cgpa" | "percentage";
  major: string;
};

export type TEmployeeEducation = {
  employee_id: string;
  educations: TEducation[];
  createdAt?: Date;
};

export type TEmployeeEducationState<T = TEmployeeEducation[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};
