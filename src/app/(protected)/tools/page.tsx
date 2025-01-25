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
import { useGetToolsQuery } from "@/redux/features/toolApiSlice/toolSlice";
import { useAppSelector } from "@/redux/hook";
import { useSearchParams } from "next/navigation";
import ToolInsert from "./_components/tool-insert";
import ToolPage from "./_components/tool-page";

const Tool = () => {
  const searchParams = useSearchParams();
  const { isDialogOpen, onDialogChange } = useDialog();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams.get("page");
  const search = searchParams.get("search");

  // get all Data
  const { data } = useGetToolsQuery({
    page: page ? Number(page) : 1,
    limit: limit,
    search: search ? search : "",
  });

  const { result: tools, meta } = data || {};

  const { localData } = useLocalCacheHook(
    {
      data: tools!,
    },
    "erp-tools"
  );

  return (
    <section className="p-8">
      <div className="flex justify-between items-center mb-6">
        <Dialog modal={true} open={isDialogOpen} onOpenChange={onDialogChange}>
          <DialogTrigger asChild>
            <Button>Add New Platform</Button>
          </DialogTrigger>
          <ToolInsert onDialogChange={onDialogChange} />
        </Dialog>
        <SearchBox />
        <Pagination total={meta?.total!} className="ml-auto hidden md:flex" />
      </div>

      <Table>
        <TableHeader className="sticky top-0">
          <TableRow className="sticky top-0">
            <TableHead className="sticky top-0 bg-white">Platform</TableHead>
            <TableHead className="sticky top-0 bg-white">Website</TableHead>
            <TableHead className="sticky top-0 bg-white">
              Organizations
            </TableHead>
            <TableHead className="sticky top-0 bg-white text-right">
              More
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!tools?.length && (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="loader">
                  <div className="loader-line" />
                </div>
              </TableCell>
            </TableRow>
          )}
          {tools?.length ? (
            <ToolPage tool={tools} />
          ) : (
            <ToolPage tool={localData} />
          )}
        </TableBody>
      </Table>

      <Pagination
        total={meta?.total!}
        className="ml-auto flex md:hidden mt-5"
      />
    </section>
  );
};

export default Tool;
