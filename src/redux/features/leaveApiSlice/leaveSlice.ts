import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import { TLeave, TLeaveState } from "./leaveType";

const leaveApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["leaves"],
});

export const leaveApi = leaveApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getLeaves: builder.query<TLeaveState, TPagination>({
      query: ({ page, limit, year }) => ({
        url: `/leave?page=${page}&limit=${limit}&year=${year}`,
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

    addNewLeaveYear: builder.mutation({
      query: (year) => {
        return {
          url: `/leave/update-year/${year}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["leaves"],
    }),

    updateLeave: builder.mutation({
      query: (data) => {
        return {
          url: `/leave/${data.employee_id}/${data.year}`,
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
  useAddNewLeaveYearMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} = leaveApi;
