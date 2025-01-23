"use client";

import CopyText from "@/components/CopyText";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { useDialog } from "@/hooks/useDialog";
import { TCourse } from "@/redux/features/courseApiSlice/courseType";
import { EditIcon, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState } from "react";
import CourseUpdate from "./CourseUpdate";

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

  // Simulate fetching course data (similar to designData)
  const singleCourse = useMemo(() => {
    return courseId === item._id ? item : null;
  }, [courseId, item]);

  return (
    <Dialog
      key={item?._id}
      modal={true}
      open={isDialogOpen}
      onOpenChange={onDialogChange}
    >
      <TableRow>
        <TableCell>
          <div className="flex items-center">
            <Image
              src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${item.website}&size=64`}
              alt={item.platform}
              width={30}
              height={30}
              className="rounded-full object-cover shrink-0 hidden lg:block mr-4"
            />
            <Link
              href={item.website}
              target="_blank"
              rel="noopener noreferrer nofollow"
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
        <DialogTrigger asChild onClick={() => setCourseId(item?._id!)}>
          <TableCell className="text-right">
            <EditIcon className="cursor-pointer inline-block" size={20} />
          </TableCell>
        </DialogTrigger>
      </TableRow>
      {singleCourse?._id && (
        <CourseUpdate course={singleCourse!} onDialogChange={onDialogChange} />
      )}
    </Dialog>
  );
};

const MemoizedCourseModal = memo(CourseModal);
