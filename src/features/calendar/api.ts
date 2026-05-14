import { apiRequest, createMutationHook, createQueryHook } from "@/lib/api-client";
import { TAllCalendarEvents, TCalendar, TCalendarState } from "@/types/calendar";

export const useGetCalendarsQuery = createQueryHook<TCalendarState, undefined>(
  () =>
    apiRequest<TCalendarState>({
      url: `/calendar`,
      method: "GET",
    }),
  ["calendar"],
);

export const useGetCalendarQuery = createQueryHook<
  TCalendarState<TCalendar>,
  number
>((year) =>
  apiRequest<TCalendarState<TCalendar>>({
    url: `/calendar/${year}`,
    method: "GET",
  }),
  ["calendar"],
);

export const useGetUpcomingHolidaysAndEventsQuery = createQueryHook<
  TAllCalendarEvents,
  string
>((date) =>
  apiRequest<TAllCalendarEvents>({
    url: `/calendar/upcoming/${date}`,
    method: "GET",
  }),
  ["calendar"],
);

export const useAddCalendarMutation = createMutationHook<
  TCalendarState,
  TCalendar
>((data) =>
  apiRequest<TCalendarState>({
    url: `/calendar`,
    method: "POST",
    body: data,
  }),
  { invalidatesTags: ["calendar"] },
);

export const useUpdateCalendarMutation = createMutationHook<unknown, any>(
  (data) =>
    apiRequest({
      url: `/calendar/${data.year}`,
      method: "PATCH",
      body: data,
    }),
  { invalidatesTags: ["calendar"] },
);

export const useDeleteCalendarMutation = createMutationHook<unknown, string>(
  (id) =>
    apiRequest({
      url: `/calendar/${id}`,
      method: "DELETE",
    }),
  { invalidatesTags: ["calendar"] },
);
