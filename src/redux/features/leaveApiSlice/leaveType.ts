export type TLeaveYear = {
  year: number;
  casual: {
    allotted: number;
    consumed: number;
  };
  earned: {
    allotted: number;
    consumed: number;
  };
  sick: {
    allotted: number;
    consumed: number;
  };
  without_pay: {
    allotted: number;
    consumed: number;
  };
};

export type TLeave = {
  employee_id: string;
  years: TLeaveYear[];
  createdAt?: Date;
};

export type TLeaveState<T = TLeave[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};
