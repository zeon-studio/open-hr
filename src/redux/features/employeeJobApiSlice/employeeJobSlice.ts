import { TPagination } from "@/types";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import { TEmployeeJob, TEmployeeJobState } from "./employeeJobType";

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
