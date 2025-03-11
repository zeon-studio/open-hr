"use client";

import Pagination from "@/components/pagination";
import useLocalCacheHook from "@/hooks/useLocalCacheHook";
import { useGetLeaveRequestsQuery } from "@/redux/features/leaveRequestApiSlice/leaveRequestSlice";
import { useAppSelector } from "@/redux/hook";
import { Button } from "@/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import LeaveRequestPage from "./_components/leave-request-page";

const LeaveRequest = () => {
  const searchParams = useSearchParams();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams?.get("page");
  const search = searchParams?.get("search");

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
    "local-leave-requests"
  );

  // check module enabled or not
  const { modules } = useAppSelector((state) => state["setting-slice"]);
  if (!modules.find((mod) => mod.name === "leave")?.enable) {
    return notFound();
  }

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h4 hidden sm:block mr-2">Leave Requests</h2>
        <Button className="ml-auto">
          <Link href="/my-leave-requests">My Requests</Link>
        </Button>
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

      <Pagination total={meta?.total!} className="ml-auto flex mt-4" />
    </section>
  );
};

export default LeaveRequest;
