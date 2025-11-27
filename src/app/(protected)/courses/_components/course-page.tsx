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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Simulate fetching course data
  const singleCourse = useMemo(() => {
    return courseId === item._id ? item : null;
  }, [courseId, item]);

  const [deleteCourse] = useDeleteCourseMutation();

  const handleCourseDelete = () => {
    deleteCourse(item._id);
    toast("Course deleted complete");
  };

  const handleAction = (action: "preview" | "edit" | "delete") => {
    if (!item?._id) return;

    setCourseId(item._id);
    setIsMenuOpen(false);

    switch (action) {
      case "preview":
        setIsPreviewOpen(true);
        break;
      case "edit":
        onDialogChange(true);
        break;
      case "delete":
        setIsDeleteDialogOpen(true);
        break;
    }
  };

  return (
    <>
      <DropdownMenu
        key={item._id}
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        modal={false}
      >
        <TableRow>
          <TableCell>
            <Dialog>
              <DialogTrigger asChild>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => setCourseId(item?._id!)}
                >
                  <ImageFallback
                    src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${item.website}&size=64`}
                    alt={item.platform}
                    width={50}
                    height={50}
                    fallback="/images/fallback.jpg"
                    className="rounded border border-border object-cover shrink-0 hidden lg:block mr-2"
                  />
                  {item.platform}
                </div>
              </DialogTrigger>
              {singleCourse?._id && (
                <CoursePreview courseData={singleCourse!} />
              )}
            </Dialog>
          </TableCell>
          <TableCell>{item.courses?.length}</TableCell>
          <TableCell>
            <Link
              href={item.website}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-medium"
            >
              {item.website}
              <ExternalLink className="inline-block ml-1 -mt-1 size-[1em]" />
            </Link>
          </TableCell>
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
              <DropdownMenuItem className="p-0">
                <Button
                  className="w-full justify-start"
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => handleAction("preview")}
                >
                  Preview
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Button
                  className="w-full justify-start"
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => handleAction("edit")}
                >
                  Edit
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Button
                  className="w-full text-destructive hover:bg-destructive justify-start"
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => handleAction("delete")}
                >
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </TableCell>
        </TableRow>
      </DropdownMenu>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        {singleCourse?._id && <CoursePreview courseData={singleCourse!} />}
      </Dialog>

      <Dialog
        modal={true}
        open={isDialogOpen}
        onOpenChange={(open) => {
          onDialogChange(open);
          if (!open) {
            setCourseId("");
          }
        }}
      >
        {singleCourse?._id && (
          <CourseUpdate
            course={singleCourse!}
            onDialogChange={onDialogChange}
          />
        )}
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        {singleCourse?._id && (
          <ConfirmationPopup
            handleConfirmation={() => {
              handleCourseDelete();
              setIsDeleteDialogOpen(false);
            }}
            id={singleCourse?._id!}
          />
        )}
      </Dialog>
    </>
  );
};

const MemoizedCourseModal = memo(CourseModal);
