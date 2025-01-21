import { TPagination } from "@/types";
import { apiSlice } from "../apiSlice/apiSlice";
import { TCalendar, TCalendarState } from "./calendarType";

const calendarApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["calendars"],
});

export const calendarApi = calendarApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getCalendars: builder.query<TCalendarState, TPagination>({
      query: ({ page, limit, search }) => ({
        url: `/calendar?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["calendars"],
      keepUnusedDataFor: 30 * 60,
    }),

    getCalendar: builder.query<TCalendarState<TCalendar>, string>({
      query: (id) => ({
        url: `/calendar/${id}`,
        method: "GET",
      }),
      providesTags: ["calendars"],
    }),

    addCalendar: builder.mutation<TCalendarState, TCalendar>({
      query: (data) => ({
        url: `/calendar`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["calendars"],
    }),

    updateCalendar: builder.mutation({
      query: (data) => {
        return {
          url: `/calendar/${data.id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["calendars"],
    }),

    deleteCalendar: builder.mutation({
      query: (id) => ({
        url: `/calendar/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["calendars"],
    }),
  }),
});

export const {
  useGetCalendarsQuery,
  useGetCalendarQuery,
  useAddCalendarMutation,
  useUpdateCalendarMutation,
  useDeleteCalendarMutation,
} = calendarApi;
