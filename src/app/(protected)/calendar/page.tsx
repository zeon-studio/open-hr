"use client";

import { useDialog } from "@/hooks/useDialog";
import useLocalCacheHook from "@/hooks/useLocalCacheHook";
import { useGetCalendarQuery } from "@/redux/features/calendarApiSlice/calendarSlice";
import {
  TCalendar,
  TEvent,
} from "@/redux/features/calendarApiSlice/calendarType";
import { useAppSelector } from "@/redux/hook";
import { Button } from "@/ui/button";
import { Dialog, DialogTrigger } from "@/ui/dialog";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import CalendarInsert from "./_components/calendar-insert";
import CalendarInsertSheet from "./_components/calendar-insert-sheet";
import CalendarList from "./_components/calendar-list";
import CalendarUpdate from "./_components/calendar-update";
import CalendarView from "./_components/calendar-view";

const getHolydaysAndEvents = (calendar: TCalendar | undefined): TEvent[] => {
  if (!calendar) return [];

  return [
    ...(calendar?.holidays?.map((holiday) => ({
      start_date: new Date(holiday.start_date!),
      end_date: new Date(holiday.end_date!),
      day_count: holiday.day_count,
      reason: holiday.reason,
      type: "holiday" as const,
    })) ?? []),
    ...(calendar?.events?.map((event) => ({
      start_date: new Date(event.start_date!),
      end_date: new Date(event.end_date!),
      day_count: event.day_count,
      reason: event.reason,
      type: "event" as const,
    })) ?? []),
    ...(calendar?.weekends?.map((weekend) => ({
      start_date: new Date(weekend.start_date!),
      end_date: new Date(weekend.end_date!),
      day_count: weekend.day_count,
      reason: weekend.reason,
      type: "weekend" as const,
    })) ?? []),
  ];
};

const renderCalendarList = (
  calendar: TCalendar | undefined,
  type: "holidays" | "events" | "weekends",
  title: string
) => {
  const items = calendar?.[type] ?? [];
  if (items.length > 0) {
    return (
      <>
        <h5 className="mt-8 mb-4">
          {title} {new Date().getFullYear()}
        </h5>
        <CalendarList listType={title} calendar={items} />
      </>
    );
  }
  return null;
};

const CalendarPage = () => {
  const { data: session } = useSession();
  const currentYear = new Date().getFullYear();

  // get calendar Data by year
  const { data } = useGetCalendarQuery(currentYear);
  const { result: calendar } = data || {};

  const { localData } = useLocalCacheHook(
    {
      data: calendar ? [calendar] : [],
    },
    "local-calendar"
  );

  const yearlyData = getHolydaysAndEvents(calendar! || localData[0]!);

  const { isDialogOpen, onDialogChange } = useDialog();

  // check module enabled or not
  const { modules } = useAppSelector((state) => state["setting-slice"]);
  if (!modules.find((mod) => mod.name === "calendar")?.enable) {
    return notFound();
  }

  return (
    <section className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4 relative sm:-mb-10 mb-1 z-10 sm:w-fit">
        {session?.user.role === "user" ? (
          <h2 className="text-h4 mr-2">
            {format(new Date(), "MMMM")} {new Date().getFullYear()}
          </h2>
        ) : (
          <>
            <div className="flex items-center max-sm:w-full">
              <Dialog
                modal={true}
                open={isDialogOpen}
                onOpenChange={onDialogChange}
              >
                <DialogTrigger asChild>
                  <Button className="w-full rounded-r-none">
                    Add Calendar Year
                  </Button>
                </DialogTrigger>
                <CalendarInsert onDialogChange={onDialogChange} />
              </Dialog>
              <CalendarInsertSheet />
            </div>
            <CalendarUpdate />
          </>
        )}
      </div>

      <CalendarView yearlyData={yearlyData!} />

      {renderCalendarList(calendar, "holidays", "Holidays")}
      {renderCalendarList(calendar, "events", "Events")}
    </section>
  );
};

export default CalendarPage;
