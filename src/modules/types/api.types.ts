export type PaginationInput = {
  page?: number;
  limit?: number;
  search?: string;
};

export type ApiResult<T> = {
  result: T;
  meta?: {
    total: number;
  };
};
