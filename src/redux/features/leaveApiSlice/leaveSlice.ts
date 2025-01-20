import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import { TLeave, TLeaveState } from "./leaveType";

const leaveApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["leaves"],
});

export const leaveApi = leaveApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getLeaves: builder.query<TLeaveState, TPagination>({
      query: ({ page, limit, search }) => ({
        url: `/leave?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["leaves"],
      keepUnusedDataFor: 30 * 60,
    }),

    getLeave: builder.query<TLeaveState<TLeave>, string>({
      query: (id) => ({
        url: `/leave/${id}`,
        method: "GET",
      }),
      providesTags: ["leaves"],
    }),

    addLeave: builder.mutation<TLeaveState, TLeave>({
      query: (data) => ({
        url: `/leave`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["leaves"],
    }),

    updateLeave: builder.mutation({
      query: (data) => {
        return {
          url: `/leave/${data.id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["leaves"],
    }),

    deleteLeave: builder.mutation({
      query: (id) => ({
        url: `/leave/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["leaves"],
    }),
  }),
});

export const {
  useGetLeavesQuery,
  useGetLeaveQuery,
  useAddLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} = leaveApi;
