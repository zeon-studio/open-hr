export type TBank = {
  bank_name: string;
  bank_ac_name: string;
  bank_ac_no: string;
  bank_district: string;
  bank_branch: string;
  bank_routing_no: string;
};

export type TEmployeeBank = {
  employee_id: string;
  banks: TBank[];
  createdAt?: Date;
};

export type TEmployeeBankState<T = TEmployeeBank[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};
