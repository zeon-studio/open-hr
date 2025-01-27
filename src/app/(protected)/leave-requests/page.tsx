"use client";

import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";
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
import {
  useGetLeaveRequestQuery,
  useGetLeaveRequestsQuery,
} from "@/redux/features/leaveRequestApiSlice/leaveRequestSlice";
import { useAppSelector } from "@/redux/hook";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import EmployeeLeaveRequestPage from "./_components/employee-leave-request-page";
import LeaveRequestInsert from "./_components/leave-request-insert";
import LeaveRequestPage from "./_components/leave-request-page";

const LeaveRequest = () => {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { isDialogOpen, onDialogChange } = useDialog();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams.get("page");
  const search = searchParams.get("search");

  // get all Data
  const { data } = useGetLeaveRequestsQuery(
    {
      page: page ? Number(page) : 1,
      limit: limit,
      search: search ? search : "",
    },
    { skip: session?.user.role === "user" }
  );

  const { result: leaveRequests, meta } = data || {};

  const { localData } = useLocalCacheHook(
    {
      data: leaveRequests!,
    },
    "erp-leave-requests"
  );

  // get single employee data
  const { data: employeeData } = useGetLeaveRequestQuery(session?.user?.id!);

  const employeeLeaveRequests = employeeData?.result!;

  return (
    <section className="p-8">
      {session?.user.role === "user" ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-h4">Leave Requests</h2>
            <Dialog
              modal={true}
              open={isDialogOpen}
              onOpenChange={onDialogChange}
            >
              <DialogTrigger asChild>
                <Button>Request Leave</Button>
              </DialogTrigger>
              <LeaveRequestInsert onDialogChange={onDialogChange} />
            </Dialog>
          </div>
          <Table>
            <TableHeader className="sticky top-0">
              <TableRow className="sticky top-0">
                <TableHead className="sticky top-0">Type</TableHead>
                <TableHead className="sticky top-0">Start Date</TableHead>
                <TableHead className="sticky top-0">End Date</TableHead>
                <TableHead className="sticky top-0">Days</TableHead>
                <TableHead className="sticky top-0">Reason</TableHead>
                <TableHead className="sticky top-0 text-right">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <EmployeeLeaveRequestPage leaveRequest={employeeLeaveRequests} />
            </TableBody>
          </Table>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <Dialog
              modal={true}
              open={isDialogOpen}
              onOpenChange={onDialogChange}
            >
              <DialogTrigger asChild>
                <Button>Request Leave</Button>
              </DialogTrigger>
              <LeaveRequestInsert onDialogChange={onDialogChange} />
            </Dialog>
            <SearchBox />
            <Pagination
              total={meta?.total!}
              className="ml-auto hidden md:flex"
            />
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
                <TableHead className="sticky top-0 text-right">
                  Status
                </TableHead>
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
        </>
      )}
    </section>
  );
};

export default LeaveRequest;
