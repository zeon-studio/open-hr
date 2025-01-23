"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { useDialog } from "@/hooks/useDialog";
import { TCourse } from "@/redux/features/courseApiSlice/courseType";
import { EditIcon } from "lucide-react";
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
        <TableCell>{item.platform}</TableCell>
        <TableCell>{item.courses.length}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell>{item.password}</TableCell>
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
