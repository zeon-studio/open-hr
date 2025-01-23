import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAddCourseMutation } from "@/redux/features/courseApiSlice/courseSlice";
import { TCourse } from "@/redux/features/courseApiSlice/courseType";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CourseForm from "./CourseForm";

const CourseInsert = ({
  onDialogChange,
}: {
  onDialogChange: (open: boolean) => void;
}) => {
  const [addCourse, { isSuccess, isError }] = useAddCourseMutation();
  const [loader, setLoader] = useState(false);
  const [courseData, setCourseData] = useState<TCourse>({
    platform: "",
    website: "",
    email: "",
    password: "",
    courses: [
      {
        name: "",
        price: 0,
        currency: "bdt",
        users: [],
      },
    ],
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      addCourse(courseData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      setCourseData({
        platform: "",
        website: "",
        email: "",
        password: "",
        courses: [
          {
            name: "",
            price: 0,
            currency: "",
            users: [""],
            purchase_date: new Date(),
            expire_date: new Date(),
          },
        ],
      });
      toast("Course added complete");
      // close modal/dialog
      onDialogChange(false);
    } else if (isError) {
      setLoader(false);
      toast("something went wrong");
    }
  }, [isSuccess]);

  return (
    <DialogContent
      className="max-w-4xl overflow-y-auto h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Add New Course Platform</DialogTitle>
      <CourseForm
        courseData={courseData}
        setCourseData={setCourseData}
        handleSubmit={handleSubmit}
        loader={loader}
        formType="insert"
      />
    </DialogContent>
  );
};

export default CourseInsert;
