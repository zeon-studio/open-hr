import { TPagination } from "@/types";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import { TAllAssetsState, TAsset, TAssetState } from "./assetType";

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
