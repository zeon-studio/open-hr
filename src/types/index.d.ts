export type TPagination = {
  page: number;
  limit: number;
  search?: string;
  year?: string;
  employee_id?: string;
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

export interface ErrorDetail {
  path: string;
  message: string;
}

export interface ErrorData {
  success: boolean;
  message: string;
  errorMessage: ErrorDetail[];
  stack: string;
}

export type ErrorResponse = {
  status: number;
  data: ErrorData;
};
