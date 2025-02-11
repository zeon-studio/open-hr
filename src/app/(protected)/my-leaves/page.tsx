"use client";

import { useGetLeaveQuery } from "@/redux/features/leaveApiSlice/leaveSlice";
import { useAppSelector } from "@/redux/hook";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import EmployeeLeavePage from "./_components/my-leave-page";

const Leave = () => {
  const { data: session } = useSession();
  // get single employee data
  const { data: employeeData } = useGetLeaveQuery(session?.user?.id!);

  const employeeLeaveYears = [...(employeeData?.result?.years || [])].sort(
    (a, b) => b.year - a.year
  );

  // check module enabled or not
  const { modules } = useAppSelector((state) => state["setting-slice"]);
  if (!modules.find((mod) => mod.name === "leave")?.enable) {
    return notFound();
  }

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h4">My Leaves Summary</h2>
      </div>
      <Table>
        <TableHeader className="sticky top-0">
          <TableRow className="sticky top-0 *:pt-2 *:h-0 !border-b-0">
            <TableHead className="text-center border-r sticky top-0"></TableHead>
            <TableHead
              className="text-center border-r sticky top-0"
              colSpan={3}
            >
              Casual Leave
            </TableHead>
            <TableHead
              className="text-center border-r sticky top-0"
              colSpan={3}
            >
              Earn Leave
            </TableHead>
            <TableHead
              className="text-center border-r sticky top-0"
              colSpan={3}
            >
              Sick Leave
            </TableHead>
            <TableHead className="text-center sticky top-0" colSpan={3}>
              Leave Without Pay
            </TableHead>
          </TableRow>

          <TableRow className="border-t-0 sticky top-0">
            <TableHead className="border-t-0 sticky top-0">Year</TableHead>
            <TableHead className="border-l sticky top-0">Allotted</TableHead>
            <TableHead className="sticky top-0">Consumed</TableHead>
            <TableHead className="border-t-0 sticky top-0">Available</TableHead>
            <TableHead className="border-l sticky top-0">Allotted</TableHead>
            <TableHead className="sticky top-0">Consumed</TableHead>
            <TableHead className="border-t-0 sticky top-0">Available</TableHead>
            <TableHead className="border-l sticky top-0">Allotted</TableHead>
            <TableHead className="sticky top-0">Consumed</TableHead>
            <TableHead className="border-t-0 sticky top-0">Available</TableHead>
            <TableHead className="border-l sticky top-0">Allotted</TableHead>
            <TableHead className="sticky top-0">Consumed</TableHead>
            <TableHead className="border-t-0 sticky top-0">Available</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!employeeLeaveYears?.length && (
            <TableRow>
              <TableCell colSpan={12}>
                <div className="loader">
                  <div className="loader-line" />
                </div>
              </TableCell>
            </TableRow>
          )}
          <EmployeeLeavePage leave={employeeLeaveYears} />
        </TableBody>
      </Table>
    </section>
  );
};

export default Leave;
