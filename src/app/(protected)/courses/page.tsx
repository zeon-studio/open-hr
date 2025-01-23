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
import { useGetCoursesQuery } from "@/redux/features/courseApiSlice/courseSlice";
import { useAppSelector } from "@/redux/hook";
import { useSearchParams } from "next/navigation";
import CourseInsert from "./_components/CourseInsert";
import CoursePage from "./_components/CoursePage";

const Course = () => {
  const searchParams = useSearchParams();
  const { isDialogOpen, onDialogChange } = useDialog();
  const { limit } = useAppSelector((state) => state.filter);
  const page = searchParams.get("page");
  const search = searchParams.get("search");

  // get all Data
  const { data } = useGetCoursesQuery({
    page: page ? Number(page) : 1,
    limit: limit,
    search: search ? search : "",
  });

  const { result: courses, meta } = data || {};

  const { localData } = useLocalCacheHook(
    {
      data: courses!,
    },
    "erp-courses"
  );

  return (
    <section className="p-8">
      <div className="flex justify-between items-center mb-6">
        <Dialog modal={true} open={isDialogOpen} onOpenChange={onDialogChange}>
          <DialogTrigger asChild>
            <Button>Add New Platform</Button>
          </DialogTrigger>
          <CourseInsert onDialogChange={onDialogChange} />
        </Dialog>
        <SearchBox searchBy="product_id" className="ml-2" />
        <Pagination total={meta?.total!} className="ml-auto" />
      </div>

      <Table>
        <TableHeader className="sticky top-0">
          <TableRow className="sticky top-0">
            <TableHead className="sticky top-0 bg-white">Platform</TableHead>
            <TableHead className="sticky top-0 bg-white">
              Total Courses
            </TableHead>
            <TableHead className="sticky top-0 bg-white">User ID</TableHead>
            <TableHead className="sticky top-0 bg-white">Password</TableHead>
            <TableHead className="sticky top-0 bg-white text-right">
              More
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!courses?.length && (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="loader">
                  <div className="loader-line" />
                </div>
              </TableCell>
            </TableRow>
          )}
          {courses?.length ? (
            <CoursePage course={courses} />
          ) : (
            <CoursePage course={localData} />
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default Course;
