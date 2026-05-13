import { TPagination } from "@/types";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import { TAllToolsState, TTool, TToolState } from "./toolType";

export const useGetToolsQuery = createQueryHook<TToolState, TPagination>(
  ({ page, limit, search }) =>
    apiRequest<TToolState>({
      url: `/tool?page=${page}&limit=${limit}&search=${search}`,
      method: "GET",
    }),
);

export const useGetToolQuery = createQueryHook<TToolState<TTool>, string>(
  (id) =>
    apiRequest<TToolState<TTool>>({
      url: `/tool/${id}`,
      method: "GET",
    }),
);

export const useGetToolsByUserQuery = createQueryHook<TAllToolsState, string>(
  (id) =>
    apiRequest<TAllToolsState>({
      url: `/tool/user/${id}`,
      method: "GET",
    }),
);

export const useAddToolMutation = createMutationHook<TToolState, TTool>(
  (data) =>
    apiRequest<TToolState>({
      url: `/tool`,
      method: "POST",
      body: data,
    }),
);

export const useUpdateToolMutation = createMutationHook<unknown, any>((data) =>
  apiRequest({
    url: `/tool/${data._id}`,
    method: "PATCH",
    body: data,
  }),
);

export const useDeleteToolMutation = createMutationHook<unknown, string>((id) =>
  apiRequest({
    url: `/tool/${id}`,
    method: "DELETE",
  }),
);
