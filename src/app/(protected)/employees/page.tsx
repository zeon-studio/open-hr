"use client";

import Pagination from "@/components/pagination";
import SearchBox from "@/components/search-box";
import { useGetEmployeesQuery } from "@/features/employee/api"
import { type TEmployee } from "@/types/employee";
import { useDialog } from "@/hooks/use-dialog";
import useLocalCacheHook from "@/hooks/use-local-cache";
import { usePaginationFilter } from "@/hooks/use-pagination-filter";
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
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import EmployeeInsert from "./_components/employee-insert";
import EmployeePage from "./_components/employee-page";

export default function Employees() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { limit } = usePaginationFilter();
  const page = searchParams?.get("page");
  const search = searchParams?.get("search");

  // get current (non-archived) employees from cache or api
  const { data } = useGetEmployeesQuery({
    page: page ? Number(page) : 1,
    limit: limit,
    search: search ? search : "",
    status: "active,pending",
  });

  // probe for any archived employees so we can conditionally show the button
  const { data: archivedProbe } = useGetEmployeesQuery({
    page: 1,
    limit: 1,
    search: "",
    status: "archived",
  });
  const hasArchived = (archivedProbe?.meta?.total ?? 0) > 0;

  const { result: employees, meta } = data || {};
  const { localData } = useLocalCacheHook(
    {
      data: employees!,
    },
    "local-employees",
  );
  const { isDialogOpen, onDialogChange } = useDialog();

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h4 hidden sm:block mr-2">Employees</h2>
        <SearchBox />
        <div className="ml-auto flex gap-2">
          {hasArchived && (
            <Button asChild variant="outline">
              <Link href="/employees-archived">Archived Employee</Link>
            </Button>
          )}
          <Dialog
            modal={true}
            open={isDialogOpen}
            onOpenChange={onDialogChange}
          >
            <DialogTrigger asChild>
              <Button>Add Employee</Button>
            </DialogTrigger>
            <EmployeeInsert onDialogChange={onDialogChange} />
          </Dialog>
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
                <div className="loader">
                  <div className="loader-line" />
                </div>
              </TableCell>
            </TableRow>
          )}

          {employees?.length ? (
            <EmployeePage employees={employees} />
          ) : (
            <EmployeePage employees={(localData as TEmployee[]) || []} />
          )}
        </TableBody>
      </Table>

      <Pagination total={meta?.total!} className="ml-auto flex mt-4" />
    </section>
  );
}
