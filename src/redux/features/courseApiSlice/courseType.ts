export type TCourseItem = {
  name: string;
  price: number;
  currency: string;
  users: string[];
  purchase_date: Date;
  expire_date: Date;
};

export type TCourse = {
  platform: string;
  website: string;
  email: string;
  password: string;
  courses: TCourseItem[];
  createdAt: Date;
};

export type TCourseState<T = TCourse[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};
