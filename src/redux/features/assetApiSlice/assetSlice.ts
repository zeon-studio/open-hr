import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import { TAllAssetsState, TAsset, TAssetState } from "./assetType";

const assetApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["assets"],
});

export const assetApi = assetApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<TAssetState, TPagination>({
      query: ({ page, limit, search }) => ({
        url: `/asset?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["assets"],
      keepUnusedDataFor: 30 * 60,
    }),

    getAsset: builder.query<TAssetState<TAsset>, string>({
      query: (id) => ({
        url: `/asset/${id}`,
        method: "GET",
      }),
      providesTags: ["assets"],
    }),

    getAssetsByUser: builder.query<TAllAssetsState, string>({
      query: (id) => ({
        url: `/asset/user/${id}`,
        method: "GET",
      }),
      providesTags: ["assets"],
    }),

    addAsset: builder.mutation<TAssetState, TAsset>({
      query: (data) => ({
        url: `/asset`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["assets"],
    }),

    updateAsset: builder.mutation({
      query: (data) => {
        return {
          url: `/asset/${data.asset_id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["assets"],
    }),

    deleteAsset: builder.mutation({
      query: (id) => ({
        url: `/asset/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["assets"],
    }),
  }),
});

export const {
  useGetAssetsQuery,
  useGetAssetQuery,
  useGetAssetsByUserQuery,
  useAddAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
} = assetApi;
