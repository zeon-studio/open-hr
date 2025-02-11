"use client";

import Pagination from "@/components/pagination";
import SearchBox from "@/components/search-box";
import { useDialog } from "@/hooks/useDialog";
import useLocalCacheHook from "@/hooks/useLocalCacheHook";
import { useGetLeaveRequestsQuery } from "@/redux/features/leaveRequestApiSlice/leaveRequestSlice";
import { useAppSelector } from "@/redux/hook";
import { Button } from "@/ui/button";
import { Dialog, DialogTrigger } from "@/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { notFound, useSearchParams } from "next/navigation";
import LeaveRequestInsert from "./_components/leave-request-insert";
import LeaveRequestPage from "./_components/leave-request-page";

const LeaveRequest = () => {
  const searchParams = useSearchParams();
  const { isDialogOpen, onDialogChange } = useDialog();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams.get("page");
  const search = searchParams.get("search");

  // get all Data
  const { data } = useGetLeaveRequestsQuery({
    page: page ? Number(page) : 1,
    limit: limit,
    search: search ? search : "",
    employee_id: "",
  });

  const { result: leaveRequests, meta } = data || {};

  const { localData } = useLocalCacheHook(
    {
      data: leaveRequests!,
    },
    "erp-leave-requests"
  );

  // check module enabled or not
  const { modules } = useAppSelector((state) => state["setting-slice"]);
  if (!modules.find((mod) => mod.name === "leave")?.enable) {
    return notFound();
  }

  return (
    <section className="p-8">
      <div className="flex justify-between items-center mb-6">
        <Dialog modal={true} open={isDialogOpen} onOpenChange={onDialogChange}>
          <DialogTrigger asChild>
            <Button>Request Leave</Button>
          </DialogTrigger>
          <LeaveRequestInsert onDialogChange={onDialogChange} />
        </Dialog>
        <SearchBox />
        <Pagination total={meta?.total!} className="ml-auto hidden md:flex" />
      </div>

      <Table>
        <TableHeader className="sticky top-0">
          <TableRow className="sticky top-0">
            <TableHead className="sticky top-0">Name</TableHead>
            <TableHead className="sticky top-0">Type</TableHead>
            <TableHead className="sticky top-0">Start Date</TableHead>
            <TableHead className="sticky top-0">End Date</TableHead>
            <TableHead className="sticky top-0">Days</TableHead>
            <TableHead className="sticky top-0">Reason</TableHead>
            <TableHead className="sticky top-0 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!leaveRequests?.length && (
            <TableRow>
              <TableCell colSpan={7}>
                <div className="loader">
                  <div className="loader-line" />
                </div>
              </TableCell>
            </TableRow>
          )}
          {leaveRequests?.length ? (
            <LeaveRequestPage leaveRequest={leaveRequests} />
          ) : (
            <LeaveRequestPage leaveRequest={localData} />
          )}
        </TableBody>
      </Table>

      <Pagination
        total={meta?.total!}
        className="ml-auto flex md:hidden mt-5"
      />
    </section>
  );
};

export default LeaveRequest;
