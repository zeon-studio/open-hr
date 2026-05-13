import { TPagination } from "@/types";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import { TLeaveRequest, TLeaveRequestState } from "./leaveRequestType";

export const useGetLeaveRequestsQuery = createQueryHook<
  TLeaveRequestState,
  TPagination
>(({ page, limit, search, employee_id }) =>
  apiRequest<TLeaveRequestState>({
    url: `/leave-request?page=${page}&limit=${limit}&search=${search}&employee_id=${employee_id}`,
    method: "GET",
  }),
);

export const useGetLeaveRequestQuery = createQueryHook<
  TLeaveRequestState,
  string
>((id) =>
  apiRequest<TLeaveRequestState>({
    url: `/leave-request/${id}`,
    method: "GET",
  }),
);

export const useGetUpcomingLeaveRequestsQuery = createQueryHook<
  TLeaveRequestState,
  string
>((date) =>
  apiRequest<TLeaveRequestState>({
    url: `/leave-request/upcoming/${date}`,
    method: "GET",
  }),
);

export const useGetUpcomingLeaveDatesRequestsQuery = createQueryHook<
  TLeaveRequestState,
  string
>((date) =>
  apiRequest<TLeaveRequestState>({
    url: `/leave-request/upcoming-dates/${date}`,
    method: "GET",
  }),
);

export const useAddLeaveRequestMutation = createMutationHook<
  TLeaveRequestState,
  TLeaveRequest
>((data) =>
  apiRequest<TLeaveRequestState>({
    url: `/leave-request`,
    method: "POST",
    body: data,
  }),
);

export const useUpdateLeaveRequestMutation = createMutationHook<unknown, any>(
  (data) =>
    apiRequest({
      url: `/leave-request/${data._id}`,
      method: "PATCH",
      body: data,
    }),
);

export const useDeleteLeaveRequestMutation = createMutationHook<
  unknown,
  string
>((id) =>
  apiRequest({
    url: `/leave-request/${id}`,
    method: "DELETE",
  }),
);
