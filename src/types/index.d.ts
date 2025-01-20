export type TPagination = {
  page: number;
  limit: number;
  search: string;
  product_id?: string;
};

export type TError = {
  response: {
    status: number;
    data: {
      status: number;
      message: string;
    };
  };
} & AxiosError;

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  result: T;
};
