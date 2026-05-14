import { apiRequest, createMutationHook, createQueryHook } from "@/lib/api-client";
import { TPagination } from "@/types";
import { TLeave, TLeaveState } from "@/types/leave";

export const useGetLeavesQuery = createQueryHook<TLeaveState, TPagination>(
  ({ page, limit, year }) =>
    apiRequest<TLeaveState>({
      url: `/leave?page=${page}&limit=${limit}&year=${year}`,
      method: "GET",
    }),
  ["leave"],
);

export const useGetLeaveQuery = createQueryHook<TLeaveState<TLeave>, string>(
  (id) =>
    apiRequest<TLeaveState<TLeave>>({
      url: `/leave/${id}`,
      method: "GET",
    }),
  ["leave"],
);

export const useAddNewLeaveYearMutation = createMutationHook<unknown, string>(
  (year) =>
    apiRequest({
      url: `/leave/update-year/${year}`,
      method: "PATCH",
    }),
  { invalidatesTags: ["leave"] },
);

export const useUpdateLeaveMutation = createMutationHook<unknown, any>((data) =>
  apiRequest({
    url: `/leave/${data.employee_id}/${data.year}`,
    method: "PATCH",
    body: data,
  }),
  { invalidatesTags: ["leave"] },
);

export const useDeleteLeaveMutation = createMutationHook<unknown, string>(
  (id) =>
    apiRequest({
      url: `/leave/${id}`,
      method: "DELETE",
    }),
  { invalidatesTags: ["leave"] },
);
