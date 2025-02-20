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
          <TableRow className="sticky top-0">
            <TableHead className="border-r sticky top-0">Year</TableHead>
            <TableHead className="text-center border-r">Casual Leave</TableHead>
            <TableHead className="text-center border-r sticky top-0">
              Sick Leave
            </TableHead>
            <TableHead className="text-center border-r sticky top-0">
              Earn Leave
            </TableHead>
            <TableHead className="text-center border-r sticky top-0">
              Leave Without Pay
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!employeeLeaveYears?.length && (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="loader">
                  <div className="loader-line" />
                </div>
              </TableCell>
            </TableRow>
          )}
          <EmployeeLeavePage leave={employeeLeaveYears} />
        </TableBody>
      </Table>
      <div className="row sm:row-cols-2 mt-4">
        <ul className="flex items-center space-x-4">
          <li className="flex items-center">
            <span className="bg-success h-2 w-2 inline-block mr-1 rounded-full" />
            Allotted
          </li>
          <li className="flex items-center">
            <span className="bg-destructive h-2 w-2 inline-block mr-1 rounded-full" />
            Consumed
          </li>
          <li className="flex items-center">
            <span className="bg-accent h-2 w-2 inline-block mr-1 rounded-full" />
            Available
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Leave;
