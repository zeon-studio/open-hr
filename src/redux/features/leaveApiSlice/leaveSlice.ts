import { TPagination } from "@/types";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import { TLeave, TLeaveState } from "./leaveType";

export const useGetLeavesQuery = createQueryHook<TLeaveState, TPagination>(
  ({ page, limit, year }) =>
    apiRequest<TLeaveState>({
      url: `/leave?page=${page}&limit=${limit}&year=${year}`,
      method: "GET",
    }),
);

export const useGetLeaveQuery = createQueryHook<TLeaveState<TLeave>, string>(
  (id) =>
    apiRequest<TLeaveState<TLeave>>({
      url: `/leave/${id}`,
      method: "GET",
    }),
);

export const useAddNewLeaveYearMutation = createMutationHook<unknown, string>(
  (year) =>
    apiRequest({
      url: `/leave/update-year/${year}`,
      method: "PATCH",
    }),
);

export const useUpdateLeaveMutation = createMutationHook<unknown, any>((data) =>
  apiRequest({
    url: `/leave/${data.employee_id}/${data.year}`,
    method: "PATCH",
    body: data,
  }),
);

export const useDeleteLeaveMutation = createMutationHook<unknown, string>(
  (id) =>
    apiRequest({
      url: `/leave/${id}`,
      method: "DELETE",
    }),
);
