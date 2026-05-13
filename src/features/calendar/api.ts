import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "@/features/employee/api";
import { TAllCalendarEvents, TCalendar, TCalendarState } from "./types";

export const useGetCalendarsQuery = createQueryHook<TCalendarState, undefined>(
  () =>
    apiRequest<TCalendarState>({
      url: `/calendar`,
      method: "GET",
    }),
);

export const useGetCalendarQuery = createQueryHook<
  TCalendarState<TCalendar>,
  number
>((year) =>
  apiRequest<TCalendarState<TCalendar>>({
    url: `/calendar/${year}`,
    method: "GET",
  }),
);

export const useGetUpcomingHolidaysAndEventsQuery = createQueryHook<
  TAllCalendarEvents,
  string
>((date) =>
  apiRequest<TAllCalendarEvents>({
    url: `/calendar/upcoming/${date}`,
    method: "GET",
  }),
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
);

export const useUpdateCalendarMutation = createMutationHook<unknown, any>(
  (data) =>
    apiRequest({
      url: `/calendar/${data.year}`,
      method: "PATCH",
      body: data,
    }),
);

export const useDeleteCalendarMutation = createMutationHook<unknown, string>(
  (id) =>
    apiRequest({
      url: `/calendar/${id}`,
      method: "DELETE",
    }),
);
