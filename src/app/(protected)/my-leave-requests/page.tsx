"use client";

import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDialog } from "@/hooks/useDialog";
import useLocalCacheHook from "@/hooks/useLocalCacheHook";
import { useGetLeaveRequestsQuery } from "@/redux/features/leaveRequestApiSlice/leaveRequestSlice";
import { useAppSelector } from "@/redux/hook";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import LeaveRequestInsert from "../leave-requests/_components/leave-request-insert";
import MyLeaveRequestPage from "./_components/my-leave-request-page";

const LeaveRequest = () => {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { isDialogOpen, onDialogChange } = useDialog();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams.get("page");

  // get all Data
  const { data } = useGetLeaveRequestsQuery({
    page: page ? Number(page) : 1,
    limit: limit,
    search: "",
    employee_id: session?.user?.id,
  });

  const { result: leaveRequests, meta } = data || {};

  const { localData } = useLocalCacheHook(
    {
      data: leaveRequests!,
    },
    "erp-my-leave-requests"
  );

  return (
    <section className="p-8">
      <div className="flex justify-between items-center mb-6">
        <Dialog modal={true} open={isDialogOpen} onOpenChange={onDialogChange}>
          <DialogTrigger asChild>
            <Button>Request Leave</Button>
          </DialogTrigger>
          <LeaveRequestInsert onDialogChange={onDialogChange} />
        </Dialog>
        <Pagination total={meta?.total!} className="ml-auto hidden md:flex" />
      </div>

      <Table>
        <TableHeader className="sticky top-0">
          <TableRow className="sticky top-0">
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
              <TableCell colSpan={6}>
                <div className="loader">
                  <div className="loader-line" />
                </div>
              </TableCell>
            </TableRow>
          )}
          {leaveRequests?.length ? (
            <MyLeaveRequestPage leaveRequest={leaveRequests} />
          ) : (
            <MyLeaveRequestPage leaveRequest={localData} />
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
