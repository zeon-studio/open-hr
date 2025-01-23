import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import { TAllToolsState, TTool, TToolState } from "./toolType";

const toolApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["tools"],
});

export const toolApi = toolApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getTools: builder.query<TToolState, TPagination>({
      query: ({ page, limit, search }) => ({
        url: `/tool?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["tools"],
      keepUnusedDataFor: 30 * 60,
    }),

    getTool: builder.query<TToolState<TTool>, string>({
      query: (id) => ({
        url: `/tool/${id}`,
        method: "GET",
      }),
      providesTags: ["tools"],
    }),

    getToolsByUser: builder.query<TAllToolsState, string>({
      query: (id) => ({
        url: `/tool/user/${id}`,
        method: "GET",
      }),
      providesTags: ["tools"],
    }),

    addTool: builder.mutation<TToolState, TTool>({
      query: (data) => ({
        url: `/tool`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tools"],
    }),

    updateTool: builder.mutation({
      query: (data) => {
        return {
          url: `/tool/${data._id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["tools"],
    }),

    deleteTool: builder.mutation({
      query: (id) => ({
        url: `/tool/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tools"],
    }),
  }),
});

export const {
  useGetToolsQuery,
  useGetToolQuery,
  useAddToolMutation,
  useGetToolsByUserQuery,
  useUpdateToolMutation,
  useDeleteToolMutation,
} = toolApi;
