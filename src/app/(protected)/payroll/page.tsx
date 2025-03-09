"use client";

import Pagination from "@/components/pagination";
import { useDialog } from "@/hooks/useDialog";
import useLocalCacheHook from "@/hooks/useLocalCacheHook";
import { useGetPayrollsQuery } from "@/redux/features/payrollApiSlice/payrollSlice";
import { useAppSelector } from "@/redux/hook";
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
import { notFound, useSearchParams } from "next/navigation";
import PayrollInsert from "./_components/payroll-insert";
import PayrollPage from "./_components/payroll-page";

const Payroll = () => {
  const searchParams = useSearchParams();
  const { isDialogOpen, onDialogChange } = useDialog();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams?.get("page");
  const search = searchParams?.get("search");

  // get all Data
  const { data } = useGetPayrollsQuery({
    page: page ? Number(page) : 1,
    limit: limit,
    search: search ? search : "",
  });

  const { result: payrolls, meta } = data || {};

  const { localData } = useLocalCacheHook(
    {
      data: payrolls!,
    },
    "local-payrolls"
  );

  // check module enabled or not
  const { modules } = useAppSelector((state) => state["setting-slice"]);

  if (!modules.find((mod) => mod.name === "payroll")?.enable) {
    return notFound();
  }

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-h4 hidden sm:block mr-2">Payroll</h2>
        <Dialog modal={true} open={isDialogOpen} onOpenChange={onDialogChange}>
          <DialogTrigger asChild>
            <Button className="ml-auto">Add Salary</Button>
          </DialogTrigger>
          <PayrollInsert onDialogChange={onDialogChange} />
        </Dialog>
      </div>

      <Table>
        <TableHeader className="sticky top-0">
          <TableRow className="sticky top-0">
            <TableHead className="sticky top-0">Employee</TableHead>
            <TableHead className="sticky top-0">Gross Salary</TableHead>
            <TableHead className="sticky top-0">Last Salary Date</TableHead>
            <TableHead className="sticky top-0 text-right">More</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!payrolls?.length && (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="loader">
                  <div className="loader-line" />
                </div>
              </TableCell>
            </TableRow>
          )}
          {payrolls?.length ? (
            <PayrollPage payroll={payrolls} />
          ) : (
            <PayrollPage payroll={localData} />
          )}
        </TableBody>
      </Table>

      <Pagination total={meta?.total!} className="ml-auto flex mt-4" />
    </section>
  );
};

export default Payroll;
