"use client";

import Pagination from "@/components/pagination";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useLocalCacheHook from "@/hooks/useLocalCacheHook";
import {
  useAddNewLeaveYearMutation,
  useGetLeaveQuery,
  useGetLeavesQuery,
} from "@/redux/features/leaveApiSlice/leaveSlice";
import { useAppSelector } from "@/redux/hook";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import EmployeeLeavePage from "./_components/employee-leave-page";
import LeavePage from "./_components/leave-page";

const Leave = () => {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams.get("page");
  const year = searchParams.get("year");
  const currentYear = new Date().getFullYear();

  const years = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

  // add new year data
  const [addNewYearLeave] = useAddNewLeaveYearMutation();
  useEffect(() => {
    addNewYearLeave(currentYear);
  }, [addNewYearLeave, currentYear]);

  // get all Data
  const { data } = useGetLeavesQuery(
    {
      page: page ? Number(page) : 1,
      limit: limit,
      year: year ? year : String(currentYear),
    },
    { skip: session?.user.role === "user" }
  );

  const { result: leaves, meta } = data || {};

  const { localData } = useLocalCacheHook(
    {
      data: leaves!,
    },
    "erp-leaves"
  );

  // get single employee data
  const { data: employeeData } = useGetLeaveQuery(session?.user?.id!);

  const employeeLeaveYears = employeeData?.result?.years!;

  return (
    <section className="p-8">
      {session?.user.role === "user" ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-h4">Leaves Summary</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center border-r"></TableHead>
                <TableHead className="text-center border-r" colSpan={3}>
                  Casual Leave
                </TableHead>
                <TableHead className="text-center border-r" colSpan={3}>
                  Earn Leave
                </TableHead>
                <TableHead className="text-center border-r" colSpan={3}>
                  Sick Leave
                </TableHead>
                <TableHead className="text-center" colSpan={3}>
                  Leave Without Pay
                </TableHead>
              </TableRow>

              <TableRow className="border-t-0">
                <TableHead className="border-t-0">Year</TableHead>
                <TableHead className="border-l">Allotted</TableHead>
                <TableHead>Consumed</TableHead>
                <TableHead className="border-t-0">Available</TableHead>
                <TableHead className="border-l">Allotted</TableHead>
                <TableHead>Consumed</TableHead>
                <TableHead className="border-t-0">Available</TableHead>
                <TableHead className="border-l">Allotted</TableHead>
                <TableHead>Consumed</TableHead>
                <TableHead className="border-t-0">Available</TableHead>
                <TableHead className="border-l">Allotted</TableHead>
                <TableHead>Consumed</TableHead>
                <TableHead className="border-t-0">Available</TableHead>
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
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Label className="hidden md:block mr-2 mb-0">Year</Label>
              <Select
                onValueChange={(value) => {
                  window.location.href = `/leaves?year=${value}`;
                }}
                defaultValue={year || String(new Date().getFullYear())}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Pagination
              total={meta?.total!}
              className="ml-auto hidden md:flex"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center border-r" colSpan={2}>
                  Employee
                </TableHead>
                <TableHead className="text-center border-r" colSpan={3}>
                  Casual Leave
                </TableHead>
                <TableHead className="text-center border-r" colSpan={3}>
                  Earn Leave
                </TableHead>
                <TableHead className="text-center border-r" colSpan={3}>
                  Sick Leave
                </TableHead>
                <TableHead className="text-center border-r" colSpan={3}>
                  Leave Without Pay
                </TableHead>
                <TableHead></TableHead>
              </TableRow>

              <TableRow className="border-t-0">
                <TableHead>Name</TableHead>
                <TableHead className="border-t-0">Year</TableHead>
                <TableHead className="border-l">Allotted</TableHead>
                <TableHead>Consumed</TableHead>
                <TableHead className="border-t-0">Available</TableHead>
                <TableHead className="border-l">Allotted</TableHead>
                <TableHead>Consumed</TableHead>
                <TableHead className="border-t-0">Available</TableHead>
                <TableHead className="border-l">Allotted</TableHead>
                <TableHead>Consumed</TableHead>
                <TableHead className="border-t-0">Available</TableHead>
                <TableHead className="border-l">Allotted</TableHead>
                <TableHead>Consumed</TableHead>
                <TableHead className="border-t-0">Available</TableHead>
                <TableHead className="border-l"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!leaves?.length && (
                <TableRow>
                  <TableCell colSpan={15}>
                    <div className="loader">
                      <div className="loader-line" />
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {leaves?.length ? (
                <LeavePage leave={leaves} />
              ) : (
                <LeavePage leave={localData} />
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

export default Leave;
