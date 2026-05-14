import { apiRequest, createMutationHook, createQueryHook } from "@/lib/api-client";
import { TPagination } from "@/types";

export type TOrganizationLog = {
  type: "renewed" | "cancelled" | "resumed" | "paused";
  description: string;
  date: Date;
};

export type TOrganization = {
  name: string;
  login_id: string;
  password: string;
  price: number;
  currency: string;
  billing: "monthly" | "quarterly" | "half-yearly" | "yearly" | "onetime";
  users: string[];
  purchase_date?: Date;
  expire_date?: Date;
  status: "active" | "expired" | "archived";
  logs: TOrganizationLog[];
};

export type TTool = {
  _id?: string;
  platform: string;
  website: string;
  organizations: TOrganization[];
  createdAt?: Date;
};

export type TToolState<T = TTool[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};

export type TAllToolsState = {
  success: boolean;
  message: string;
  result: (TOrganization & { platform: string; website: string })[];
};

export const useGetToolsQuery = createQueryHook<TToolState, TPagination>(
  ({ page, limit, search }) =>
    apiRequest<TToolState>({
      url: `/tool?page=${page}&limit=${limit}&search=${search}`,
      method: "GET",
    }),
  ["tool"],
);

export const useGetToolQuery = createQueryHook<TToolState<TTool>, string>(
  (id) =>
    apiRequest<TToolState<TTool>>({
      url: `/tool/${id}`,
      method: "GET",
    }),
  ["tool"],
);

export const useGetToolsByUserQuery = createQueryHook<TAllToolsState, string>(
  (id) =>
    apiRequest<TAllToolsState>({
      url: `/tool/user/${id}`,
      method: "GET",
    }),
  ["tool"],
);

export const useAddToolMutation = createMutationHook<TToolState, TTool>(
  (data) =>
    apiRequest<TToolState>({
      url: `/tool`,
      method: "POST",
      body: data,
    }),
  { invalidatesTags: ["tool"] },
);

export const useUpdateToolMutation = createMutationHook<unknown, any>((data) =>
  apiRequest({
    url: `/tool/${data._id}`,
    method: "PATCH",
    body: data,
  }),
  { invalidatesTags: ["tool"] },
);

export const useDeleteToolMutation = createMutationHook<unknown, string>((id) =>
  apiRequest({
    url: `/tool/${id}`,
    method: "DELETE",
  }),
  { invalidatesTags: ["tool"] },
);
