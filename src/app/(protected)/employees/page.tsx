"use client";

import Pagination from "@/components/pagination";
import SearchBox from "@/components/search-box";
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
import { useGetEmployeesQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { useAppSelector } from "@/redux/hook";
import { useSearchParams } from "next/navigation";
import EmployeeInsert from "./_components/employee-insert";
import EmployeePage from "./_components/employee-page";

export default function Employees() {
  const searchParams = useSearchParams();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams.get("page");
  const search = searchParams.get("search");

  // get all employees from cache or api
  const { data } = useGetEmployeesQuery({
    page: page ? Number(page) : 1,
    limit: limit,
    search: search ? search : "",
  });

  const { result: employees, meta } = data || {};
  const { localData } = useLocalCacheHook(
    {
      data: employees!,
    },
    "erp-leave-requests"
  );
  const { isDialogOpen, onDialogChange } = useDialog();

  return (
    <section className="p-8">
      <div className="flex justify-between items-center mb-6">
        <Dialog modal={true} open={isDialogOpen} onOpenChange={onDialogChange}>
          <DialogTrigger asChild>
            <Button>Add Employee</Button>
          </DialogTrigger>
          <EmployeeInsert onDialogChange={onDialogChange} />
        </Dialog>
        <SearchBox />
        <Pagination total={meta?.total!} className="ml-auto hidden md:flex" />
      </div>

      <Table>
        <TableHeader className="sticky top-0">
          <TableRow className="sticky top-0">
            <TableHead className="sticky top-0">Name</TableHead>
            <TableHead className="sticky top-0">Email</TableHead>
            <TableHead className="sticky top-0">Phone </TableHead>

            <TableHead className="sticky top-0">Department</TableHead>
            <TableHead className="sticky top-0 text-left">
              Designation
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!employees?.length && (
            <TableRow>
              <TableCell colSpan={7}>
                <div className="loader">
                  <div className="loader-line" />
                </div>
              </TableCell>
            </TableRow>
          )}

          {employees?.length ? (
            //  @ts-ignore
            <EmployeePage employees={employees} />
          ) : (
            //  @ts-ignore
            <EmployeePage employees={localData} />
          )}
        </TableBody>
      </Table>

      <Pagination
        total={meta?.total!}
        className="ml-auto flex md:hidden mt-5"
      />
    </section>
  );
}
