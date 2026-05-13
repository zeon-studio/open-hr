import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "@/features/employee/api";
import { TPagination } from "@/types";

export type TAssetLog = {
  type: "handover" | "repair" | "takeover" | "other";
  description: string;
  date: Date;
};

export type TAsset = {
  asset_id?: string;
  user: string;
  name: string;
  type:
    | "macbook"
    | "macmini"
    | "imac"
    | "laptop"
    | "desktop"
    | "mobile"
    | "keyboard"
    | "mouse"
    | "monitor"
    | "headset"
    | "printer"
    | "router"
    | "other";
  serial_number: string;
  price: number;
  currency: "bdt" | "usd";
  purchase_date: Date;
  status: "engaged" | "archived" | "lost" | "damaged" | "sold";
  note: string;
  logs: TAssetLog[];
  createdAt?: Date;
};

export type TAssetState<T = TAsset[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};

export type TAllAssetsState = {
  success: boolean;
  message: string;
  result: (TAsset & { handover: TAssetLog })[];
};

export const useGetAssetsQuery = createQueryHook<TAssetState, TPagination>(
  ({ page, limit, search }) =>
    apiRequest<TAssetState>({
      url: `/asset?page=${page}&limit=${limit}&search=${search}`,
      method: "GET",
    }),
);

export const useGetAssetQuery = createQueryHook<TAssetState<TAsset>, string>(
  (id) =>
    apiRequest<TAssetState<TAsset>>({
      url: `/asset/${id}`,
      method: "GET",
    }),
);

export const useGetAssetsByUserQuery = createQueryHook<TAllAssetsState, string>(
  (id) =>
    apiRequest<TAllAssetsState>({
      url: `/asset/user/${id}`,
      method: "GET",
    }),
);

export const useAddAssetMutation = createMutationHook<TAssetState, TAsset>(
  (data) =>
    apiRequest<TAssetState>({
      url: `/asset`,
      method: "POST",
      body: data,
    }),
);

export const useUpdateAssetMutation = createMutationHook<unknown, any>((data) =>
  apiRequest({
    url: `/asset/${data.asset_id}`,
    method: "PATCH",
    body: data,
  }),
);

export const useDeleteAssetMutation = createMutationHook<unknown, string>(
  (id) =>
    apiRequest({
      url: `/asset/${id}`,
      method: "DELETE",
    }),
);
