import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateCourseMutation } from "@/redux/features/courseApiSlice/courseSlice";
import { TCourse } from "@/redux/features/courseApiSlice/courseType";
import { useEffect, useState } from "react";
import CourseForm from "./CourseForm";

const CourseUpdate = ({
  course,
  onDialogChange,
}: {
  course: TCourse;
  onDialogChange: (open: boolean) => void;
}) => {
  const { toast } = useToast();
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
    updateCourse(courseData);
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      toast({
        title: "Course Update complete",
      });
      // close modal
      onDialogChange(false);
    } else if (isError) {
      setLoader(false);
      toast({
        title: "something went wrong",
      });
      console.log(error);
    }
  }, [isSuccess]);

  return (
    <DialogContent
      className="max-w-4xl overflow-y-auto h-[90vh]"
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
