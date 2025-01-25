"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/useDialog";
import useLocalCacheHook from "@/hooks/useLocalCacheHook";
import { useGetCalendarsQuery } from "@/redux/features/calendarApiSlice/calendarSlice";
import { TEvent } from "@/redux/features/calendarApiSlice/calendarType";
import { useAppSelector } from "@/redux/hook";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import CustomEventCalendar from "./_components/CustomEventCalendar";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CalendarInsert from "./_components/CalendarInsert";
import HolidayTable from "./_components/HolidayTable";

const Calendarcomponent = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const searchParams = useSearchParams();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams.get("page");
  const search = searchParams.get("search");
  // get all calendar Data
  const { data, error } = useGetCalendarsQuery({
    page: page ? Number(page) : 1,
    limit: limit,
    search: search ? search : "",
  });

  const { result: calendars, meta } = data || {};

  const { localData } = useLocalCacheHook(
    {
      data: calendars!,
    },
    "erp-calendars"
  );

  const currentYear = calendars?.filter(
    (cal) => new Date().getFullYear() === cal?.year
  );
  let events = currentYear?.map((a) => [
    ...a.holidays.map((holiday) => ({
      start_date: new Date(holiday.start_date),
      end_date: new Date(holiday.end_date),
      day_count: holiday.day_count,
      reason: holiday.reason,
      type: "holiday",
    })),
    ...a.events.map((event) => ({
      start_date: new Date(event.start_date),
      end_date: new Date(event.end_date),
      day_count: event.day_count,
      reason: event.reason,
      type: "event",
    })),
  ]);

  const { isDialogOpen, onDialogChange } = useDialog();

  return (
    <section className="p-4">
      <div className="flex justify-between items-center relative -mb-10 z-10 w-fit">
        <Dialog modal={true} open={isDialogOpen} onOpenChange={onDialogChange}>
          <DialogTrigger asChild>
            <Button>Add New</Button>
          </DialogTrigger>
          <CalendarInsert onDialogChange={onDialogChange} />
        </Dialog>
      </div>

      <CustomEventCalendar events={events?.[0] as TEvent[]} />

      {(currentYear?.[0]?.holidays ?? []).length > 0 && (
        <>
          <h3 className="mt-8 mb-4">Holidays {new Date().getFullYear()}</h3>
          <HolidayTable
            reason={"Holidays"}
            calendar={currentYear![0]?.holidays}
          />
        </>
      )}

      {(currentYear?.[0]?.events ?? []).length > 0 && (
        <>
          <h3 className="mt-8 mb-4">Events {new Date().getFullYear()}</h3>
          <HolidayTable reason={"Events"} calendar={currentYear![0]?.events} />
        </>
      )}
    </section>
  );
};

export default Calendarcomponent;
