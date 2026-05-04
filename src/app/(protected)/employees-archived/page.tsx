"use client";

import Pagination from "@/components/pagination";
import SearchBox from "@/components/search-box";
import useLocalCacheHook from "@/hooks/useLocalCacheHook";
import { useGetEmployeesQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
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
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import EmployeePage from "../employees/_components/employee-page";

export default function ArchivedEmployees() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams?.get("page");
  const search = searchParams?.get("search");

  const { data } = useGetEmployeesQuery({
    page: page ? Number(page) : 1,
    limit: limit,
    search: search ? search : "",
    status: "archived",
  });

  const { result: employees, meta } = data || {};
  const { localData } = useLocalCacheHook(
    {
      data: employees!,
    },
    "local-employees-archived"
  );

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h4 hidden sm:block mr-2">Archived Employees</h2>
        <SearchBox />
        <div className="ml-auto">
          <Button asChild variant="outline">
            <Link href="/employees">Back to Employees</Link>
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader className="sticky top-0">
          <TableRow className="sticky top-0">
            <TableHead className="sticky top-0">Name</TableHead>
            <TableHead className="sticky top-0">Department</TableHead>
            <TableHead className="sticky top-0">Email</TableHead>
            <TableHead className="sticky top-0">Phone</TableHead>
            <TableHead className="sticky top-0">Status</TableHead>

            {session?.user?.role === "admin" && (
              <TableHead className="sticky top-0 text-right">More</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!employees?.length && (
            <TableRow>
              <TableCell colSpan={session?.user?.role === "admin" ? 6 : 5}>
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No archived employees.
                </div>
              </TableCell>
            </TableRow>
          )}

          {employees?.length ? (
            <EmployeePage employees={employees} />
          ) : (
            <EmployeePage employees={localData} />
          )}
        </TableBody>
      </Table>

      <Pagination total={meta?.total!} className="ml-auto flex mt-4" />
    </section>
  );
}
