export type TSalary = {
  amount: number;
  date: Date;
};

export type TBonus = {
  type: "festive" | "performance" | "project" | "other";
  reason: string;
  amount: number;
  date: Date;
};

export type TIncrement = {
  reason: string;
  amount: number;
  date: Date;
};

export type TCreateMonthlySalary = {
  salary_date: Date;
  employees: {
    employee_id: string;
    gross_salary: number;
    bonus_type: string;
    bonus_reason: string;
    bonus_amount: number;
  }[];
};

export type TPayroll = {
  employee_id: string;
  gross_salary: number;
  salary: TSalary[];
  bonus: TBonus[];
  increments: TIncrement[];
  status: "active" | "archived";
};

export type TPayrollState<T = TPayroll[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};
