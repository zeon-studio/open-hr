import { useUpdateCourseMutation } from "@/redux/features/courseApiSlice/courseSlice";
import { TCourse } from "@/redux/features/courseApiSlice/courseType";
import { DialogContent, DialogTitle } from "@/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CourseForm from "./course-form";

const CourseUpdate = ({
  course,
  onDialogChange,
}: {
  course: TCourse;
  onDialogChange: (open: boolean) => void;
}) => {
  const [loader, setLoader] = useState(false);
  const dialogContentRef = useRef<HTMLDivElement | null>(null);
  const [courseData, setCourseData] = useState({
    _id: course._id,
    platform: course.platform,
    website: course.website,
    email: course.email,
    password: course.password,
    courses: course.courses,
  });

  const [updateCourse, { isSuccess, isError, error }] =
    useUpdateCourseMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    updateCourse(courseData);
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      toast("Course Update complete");
      // close modal
      onDialogChange(false);
    } else if (isError) {
      setLoader(false);
      toast("Something went wrong");
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <DialogContent ref={dialogContentRef} className="max-w-4xl!">
      <DialogTitle className="mb-4">Update Course Platform</DialogTitle>
      <div className="max-h-[90vh] overflow-y-auto pr-2">
        <CourseForm
          courseData={courseData}
          setCourseData={setCourseData}
          handleSubmit={handleSubmit}
          formType="update"
          loader={loader}
          popoverContainer={dialogContentRef.current}
        />
      </div>
    </DialogContent>
  );
};

export default CourseUpdate;
