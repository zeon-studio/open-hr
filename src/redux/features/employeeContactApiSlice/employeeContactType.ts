export type TContact = {
  name: string;
  relation: string;
  phone: string;
};

export type TEmployeeContact = {
  employee_id: string;
  contacts: TContact[];
  createdAt?: Date;
};

export type TEmployeeContactState<T = TEmployeeContact[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};
