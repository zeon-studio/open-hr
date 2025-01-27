"use client";

import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/useDialog";
import { useGetCalendarsQuery } from "@/redux/features/calendarApiSlice/calendarSlice";
import { TCalendar } from "@/redux/features/calendarApiSlice/calendarType";
import { useAppSelector } from "@/redux/hook";
import { useSearchParams } from "next/navigation";
import CustomEventCalendar from "./_components/CustomEventCalendar";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import CalendarInsert from "./_components/CalendarInsert";
import CalendarInsertSheet from "./_components/CalendarInsertSheet";
import CalendarUpdate from "./_components/CalendarUpdate";
import HolidayTable from "./_components/HolidayTable";

const Calendarcomponent = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams.get("page");
  const search = searchParams.get("search");
  // get all calendar Data
  const { data } = useGetCalendarsQuery({
    page: page ? Number(page) : 1,
    limit: limit,
    search: search ? search : "",
  });

  const { result: calendars } = data || {};

  const currentYearCalendar = calendars?.filter(
    (cal) => new Date().getFullYear() === cal?.year
  );

  const events = calendars?.flatMap((cal) => [
    ...cal.holidays.map((holiday) => ({
      start_date: new Date(holiday.start_date),
      end_date: new Date(holiday.end_date),
      day_count: holiday.day_count,
      reason: holiday.reason,
      type: "holiday",
    })),
    ...cal.events.map((event) => ({
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4 relative sm:-mb-10 mb-1 z-10 sm:w-fit">
        {session?.user.role === "admin" ? (
          <>
            <div className="flex items-center max-sm:w-full">
              <Dialog
                modal={true}
                open={isDialogOpen}
                onOpenChange={onDialogChange}
              >
                <DialogTrigger asChild>
                  <Button className="w-full rounded-r-none">Add New</Button>
                </DialogTrigger>
                <CalendarInsert onDialogChange={onDialogChange} />
              </Dialog>
              <CalendarInsertSheet />
            </div>
            <CalendarUpdate calendarData={calendars as TCalendar[]} />
          </>
        ) : (
          <h4>
            {format(new Date(), "MMMM")} {new Date().getFullYear()}
          </h4>
        )}
      </div>

      <CustomEventCalendar events={events ?? []} />

      {(currentYearCalendar?.[0]?.holidays ?? []).length > 0 && (
        <>
          <h5 className="mt-8 mb-4">Holidays {new Date().getFullYear()}</h5>
          <HolidayTable
            reason={"Holidays"}
            calendar={currentYearCalendar![0]?.holidays}
          />
        </>
      )}

      {(currentYearCalendar?.[0]?.events ?? []).length > 0 && (
        <>
          <h5 className="mt-8 mb-4">Events {new Date().getFullYear()}</h5>
          <HolidayTable
            reason={"Events"}
            calendar={currentYearCalendar![0]?.events}
          />
        </>
      )}
    </section>
  );
};

export default Calendarcomponent;
