import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "@/features/employee/api";
import { TPagination } from "@/types";

export type TPrevJob = {
  company_name: string;
  company_website: string;
  designation: string;
  start_date: Date;
  end_date: Date;
  job_type: "full_time" | "part_time" | "remote" | "contractual" | "internship";
};

export type TPromotion = {
  designation: string;
  promotion_date: Date;
};

export type TEmployeeJob = {
  employee_id: string;
  job_type: "full_time" | "part_time" | "remote" | "contractual" | "internship";
  manager_id: string;
  joining_date: Date;
  permanent_date: Date;
  resignation_date: Date;
  prev_jobs: TPrevJob[];
  promotions: TPromotion[];
  note: string;
  createdAt?: Date;
};

export type TEmployeeJobState<T = TEmployeeJob[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};

const normalizeEmployeeJob = (
  response: TEmployeeJobState<TEmployeeJob>,
): TEmployeeJobState<TEmployeeJob> => {
  if (!response.result) {
    return response;
  }

  const result = { ...response.result };

  if (result.promotions) {
    result.promotions = [...result.promotions].sort(
      (a, b) =>
        new Date(b.promotion_date).getTime() -
        new Date(a.promotion_date).getTime(),
    );
  }

  if (result.prev_jobs) {
    result.prev_jobs = [...result.prev_jobs].sort(
      (a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime(),
    );
  }

  return {
    ...response,
    result,
  };
};

export const useGetEmployeeJobsQuery = createQueryHook<
  TEmployeeJobState,
  TPagination
>(({ page, limit, search }) =>
  apiRequest<TEmployeeJobState>({
    url: `/employee-job?page=${page}&limit=${limit}&search=${search}`,
    method: "GET",
  }),
);

export const useGetEmployeeJobQuery = createQueryHook<
  TEmployeeJobState<TEmployeeJob>,
  string
>((id) =>
  apiRequest<TEmployeeJobState<TEmployeeJob>>({
    url: `/employee-job/${id}`,
    method: "GET",
  }).then(normalizeEmployeeJob),
);

export const useAddEmployeeJobMutation = createMutationHook<
  TEmployeeJobState,
  TEmployeeJob
>((data) =>
  apiRequest<TEmployeeJobState>({
    url: `/employee-job`,
    method: "POST",
    body: data,
  }),
);

export const useUpdateEmployeeJobMutation = createMutationHook<
  TEmployeeJobState,
  Partial<TEmployeeJob>
>((data) =>
  apiRequest<TEmployeeJobState>({
    url: `/employee-job/${data.employee_id}`,
    method: "PATCH",
    body: data,
  }),
);

export const useDeleteEmployeeJobMutation = createMutationHook<unknown, string>(
  (id) =>
    apiRequest({
      url: `/employee-job/${id}`,
      method: "DELETE",
    }),
);
