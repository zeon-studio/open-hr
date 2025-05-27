"use client";

import Pagination from "@/components/pagination";
import useLocalCacheHook from "@/hooks/useLocalCacheHook";
import {
  useAddNewLeaveYearMutation,
  useGetLeavesQuery,
} from "@/redux/features/leaveApiSlice/leaveSlice";
import { useAppSelector } from "@/redux/hook";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import LeavePage from "./_components/leave-page";

const Leave = () => {
  const searchParams = useSearchParams();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams?.get("page");
  const year = searchParams?.get("year");
  const currentYear = new Date().getFullYear();

  const getYears = (start_year: number, end_year: number) =>
    Array.from({ length: end_year - start_year + 1 }, (_, i) =>
      (start_year + i).toString()
    );

  // add new year data
  const [addNewYearLeave] = useAddNewLeaveYearMutation();
  useEffect(() => {
    addNewYearLeave(currentYear);
  }, [addNewYearLeave, currentYear]);

  // get all Data
  const { data } = useGetLeavesQuery({
    page: page ? Number(page) : 1,
    limit: limit,
    year: year ? year : String(currentYear),
  });

  const { result: leaves, meta } = data || {};

  const { localData } = useLocalCacheHook(
    {
      data: leaves!,
    },
    "local-leaves"
  );

  // check module enabled or not
  const { modules, leaves: leaveSetting } = useAppSelector(
    (state) => state["setting-slice"]
  );

  // leave type enabled or not
  const casualEnabled = leaveSetting.some((item) => item.name === "casual");
  const sickEnabled = leaveSetting.some((item) => item.name === "sick");
  const earnedEnabled = leaveSetting.some((item) => item.name === "earned");
  const withoutPayEnabled = leaveSetting.some(
    (item) => item.name === "without_pay"
  );

  // check module enabled or not
  if (!modules.find((mod) => mod.name === "leave")?.enable) {
    return notFound();
  }

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h4 hidden sm:block mr-2">Leaves</h2>
        <div className="flex items-center ml-auto">
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
              {getYears(2024, currentYear).map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader className="sticky top-0">
          <TableRow className="sticky top-0">
            <TableHead className="text-center border-r border-border sticky top-0">
              Employee
            </TableHead>
            {casualEnabled && (
              <TableHead className="text-center border-r border-border sticky top-0">
                Casual Leave
              </TableHead>
            )}
            {sickEnabled && (
              <TableHead className="text-center border-border border-r sticky top-0">
                Sick Leave
              </TableHead>
            )}
            {earnedEnabled && (
              <TableHead className="text-center border-border border-r sticky top-0">
                Earn Leave
              </TableHead>
            )}
            {withoutPayEnabled && (
              <TableHead className="text-center border-border border-r sticky top-0">
                Leave Without Pay
              </TableHead>
            )}
            <TableHead className="sticky top-0"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!leaves?.length && (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="loader">
                  <div className="loader-line" />
                </div>
              </TableCell>
            </TableRow>
          )}
          {leaves?.length ? (
            <LeavePage
              leave={leaves}
              casualEnabled={casualEnabled}
              sickEnabled={sickEnabled}
              earnedEnabled={earnedEnabled}
              withoutPayEnabled={withoutPayEnabled}
            />
          ) : (
            <LeavePage
              leave={localData}
              casualEnabled={casualEnabled}
              sickEnabled={sickEnabled}
              earnedEnabled={earnedEnabled}
              withoutPayEnabled={withoutPayEnabled}
            />
          )}
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
        <Pagination total={meta?.total!} className="ml-auto flex" />
      </div>
    </section>
  );
};

export default Leave;
