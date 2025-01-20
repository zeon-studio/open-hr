export type TOrganization = {
  name: string;
  login_id: string;
  password: string;
  price: number;
  currency: string;
  users: string[];
  purchase_date: Date;
  expire_date: Date;
};

export type TTool = {
  platform: string;
  website: string;
  organizations: TOrganization[];
  createdAt: Date;
};

export type TToolState<T = TTool[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};
