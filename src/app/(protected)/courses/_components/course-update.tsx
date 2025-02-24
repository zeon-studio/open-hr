import { useUpdateCourseMutation } from "@/redux/features/courseApiSlice/courseSlice";
import { TCourse } from "@/redux/features/courseApiSlice/courseType";
import { DialogContent, DialogTitle } from "@/ui/dialog";
import { useEffect, useState } from "react";
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
    <DialogContent
      className="!max-w-4xl overflow-y-auto max-h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Update Course Platform</DialogTitle>
      <CourseForm
        courseData={courseData}
        setCourseData={setCourseData}
        handleSubmit={handleSubmit}
        formType="update"
        loader={loader}
      />
    </DialogContent>
  );
};

export default CourseUpdate;
