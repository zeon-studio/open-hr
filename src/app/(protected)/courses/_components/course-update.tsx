import { useUpdateCourseMutation, type TCourse } from "@/features/course/api";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
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
      toast((error as any)?.data?.message || "Something went wrong");
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <DialogContent className="max-w-4xl!">
      <DialogTitle className="mb-4">Update Course Platform</DialogTitle>
      <div className="max-h-[90vh] overflow-y-auto pr-2">
        <CourseForm
          courseData={courseData}
          setCourseData={setCourseData}
          handleSubmit={handleSubmit}
          formType="update"
          loader={loader}
        />
      </div>
    </DialogContent>
  );
};

export default CourseUpdate;
