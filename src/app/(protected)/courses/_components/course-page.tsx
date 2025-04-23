"use client";

import ConfirmationPopup from "@/components/confirmation-popup";
import CopyText from "@/components/copy-text";
import ImageFallback from "@/components/image-fallback";
import { useDialog } from "@/hooks/useDialog";
import { useDeleteCourseMutation } from "@/redux/features/courseApiSlice/courseSlice";
import { TCourse } from "@/redux/features/courseApiSlice/courseType";
import { Button } from "@/ui/button";
import { Dialog, DialogTrigger } from "@/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { TableCell, TableRow } from "@/ui/table";
import { Ellipsis, ExternalLink } from "lucide-react";
import Link from "next/link";
import { memo, useMemo, useState } from "react";
import { toast } from "sonner";
import CoursePreview from "./course-preview";
import CourseUpdate from "./course-update";

const CoursePage = ({ course }: { course: TCourse[] }) => {
  const [courseId, setCourseId] = useState<string>("");

  return (
    <>
      {course?.map((item) => (
        <MemoizedCourseModal
          courseId={courseId}
          setCourseId={setCourseId}
          key={item._id}
          item={item}
        />
      ))}
    </>
  );
};

export default CoursePage;

const CourseModal = ({
  item,
  courseId,
  setCourseId,
}: {
  item: TCourse;
  courseId: string;
  setCourseId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { isDialogOpen, onDialogChange } = useDialog();

  // Simulate fetching course data
  const singleCourse = useMemo(() => {
    return courseId === item._id ? item : null;
  }, [courseId, item]);

  const [deleteCourse] = useDeleteCourseMutation();

  const handleCourseDelete = () => {
    deleteCourse(item._id);
    toast("Course deleted complete");
  };

  return (
    <DropdownMenu key={item._id}>
      <TableRow>
        <TableCell>
          <div className="flex items-center">
            <ImageFallback
              src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${item.website}&size=64`}
              alt={item.platform}
              width={50}
              height={50}
              fallback="/images/fallback.jpg"
              className="rounded border border-border object-cover shrink-0 hidden lg:block mr-2"
            />
            <Link
              href={item.website}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-medium"
            >
              {item.platform}
              <ExternalLink className="inline-block ml-1 -mt-1 size-[1em]" />
            </Link>
          </div>
        </TableCell>
        <TableCell>{item.courses?.length}</TableCell>
        <TableCell>
          <CopyText text={item.email} />
        </TableCell>
        <TableCell>
          <CopyText text={item.password} isPassword />
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenuTrigger>
            <Ellipsis className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* preview */}
            <DropdownMenuItem asChild>
              <Dialog modal={true}>
                <DialogTrigger asChild onClick={() => setCourseId(item?._id!)}>
                  <Button
                    className="w-full justify-start"
                    variant={"ghost"}
                    size={"sm"}
                  >
                    Preview
                  </Button>
                </DialogTrigger>
                {singleCourse?._id && (
                  <CoursePreview courseData={singleCourse!} />
                )}
              </Dialog>
            </DropdownMenuItem>
            {/* edit */}
            <DropdownMenuItem asChild>
              <Dialog
                modal={true}
                open={isDialogOpen}
                onOpenChange={onDialogChange}
              >
                <DialogTrigger asChild onClick={() => setCourseId(item?._id!)}>
                  <Button
                    className="w-full justify-start"
                    variant={"ghost"}
                    size={"sm"}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                {singleCourse?._id && (
                  <CourseUpdate
                    course={singleCourse!}
                    onDialogChange={onDialogChange}
                  />
                )}
              </Dialog>
            </DropdownMenuItem>
            {/* delete */}
            <DropdownMenuItem asChild>
              <Dialog>
                <DialogTrigger asChild onClick={() => setCourseId(item?._id!)}>
                  <Button
                    className="w-full text-destructive hover:bg-destructive justify-start"
                    variant={"ghost"}
                    size={"sm"}
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                {singleCourse?._id && (
                  <ConfirmationPopup
                    handleConfirmation={handleCourseDelete}
                    id={singleCourse?._id!}
                  />
                )}
              </Dialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </TableCell>
      </TableRow>
    </DropdownMenu>
  );
};

const MemoizedCourseModal = memo(CourseModal);
