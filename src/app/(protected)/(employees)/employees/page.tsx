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
import { useGetEmployeesQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { useAppSelector } from "@/redux/hook";
import { useSearchParams } from "next/navigation";
import EmployeeInsert from "./_components/EmployeeInsert";
import UserPage from "./_components/EmployeePage";

const Customers = () => {
  const searchParams = useSearchParams();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams.get("page");
  const search = searchParams.get("search");
  // get all user Data
  const { data, error } = useGetEmployeesQuery({
    page: page ? Number(page) : 1,
    limit: limit,
    search: search ? search : "",
  });

  const { result: employees, meta } = data || {};
  const { localData } = useLocalCacheHook(
    {
      data: employees!,
    },
    "erp-employees"
  );

  const { isDialogOpen, onDialogChange } = useDialog();

  return (
    <section className="p-4">
      <div className="flex justify-between items-center mb-6">
        <Dialog modal={true} open={isDialogOpen} onOpenChange={onDialogChange}>
          <DialogTrigger asChild>
            <Button>Add New</Button>
          </DialogTrigger>
          <EmployeeInsert onDialogChange={onDialogChange} />
        </Dialog>
        <SearchBox />
        <Pagination total={meta?.total!} className="ml-auto" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky top-0 bg-white">Customer</TableHead>
            <TableHead className="sticky top-0 bg-white">
              Customer Created
            </TableHead>
            <TableHead className="sticky top-0 bg-white">Location</TableHead>
            <TableHead className="sticky top-0 bg-white">Package</TableHead>
            <TableHead className="text-right sticky top-0 bg-white">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!employees?.length && (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="loader">
                  <div className="loader-line" />
                </div>
              </TableCell>
            </TableRow>
          )}
          {employees?.length ? (
            <UserPage employees={employees!} />
          ) : (
            <UserPage employees={localData!} />
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default Customers;
