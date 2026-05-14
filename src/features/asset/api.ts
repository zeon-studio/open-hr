import { apiRequest, createMutationHook, createQueryHook } from "@/lib/api-client";
import { TPagination } from "@/types";
import type { TAllAssetsState, TAsset, TAssetState } from "@/types/asset";

export const useGetAssetsQuery = createQueryHook<TAssetState, TPagination>(
  ({ page, limit, search }) =>
    apiRequest<TAssetState>({
      url: `/asset?page=${page}&limit=${limit}&search=${search}`,
      method: "GET",
    }),
  ["asset"],
);

export const useGetAssetQuery = createQueryHook<TAssetState<TAsset>, string>(
  (id) =>
    apiRequest<TAssetState<TAsset>>({
      url: `/asset/${id}`,
      method: "GET",
    }),
  ["asset"],
);

export const useGetAssetsByUserQuery = createQueryHook<TAllAssetsState, string>(
  (id) =>
    apiRequest<TAllAssetsState>({
      url: `/asset/user/${id}`,
      method: "GET",
    }),
  ["asset"],
);

export const useAddAssetMutation = createMutationHook<TAssetState, TAsset>(
  (data) =>
    apiRequest<TAssetState>({
      url: `/asset`,
      method: "POST",
      body: data,
    }),
  { invalidatesTags: ["asset"] },
);

export const useUpdateAssetMutation = createMutationHook<unknown, any>((data) =>
  apiRequest({
    url: `/asset/${data.asset_id}`,
    method: "PATCH",
    body: data,
  }),
  { invalidatesTags: ["asset"] },
);

export const useDeleteAssetMutation = createMutationHook<unknown, string>(
  (id) =>
    apiRequest({
      url: `/asset/${id}`,
      method: "DELETE",
    }),
  { invalidatesTags: ["asset"] },
);
