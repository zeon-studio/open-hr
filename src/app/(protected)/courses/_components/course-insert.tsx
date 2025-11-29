import { useAddCourseMutation } from "@/redux/features/courseApiSlice/courseSlice";
import { TCourse } from "@/redux/features/courseApiSlice/courseType";
import { DialogContent, DialogTitle } from "@/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CourseForm from "./course-form";

const CourseInsert = ({
  onDialogChange,
}: {
  onDialogChange: (open: boolean) => void;
}) => {
  const [addCourse, { isSuccess, isError }] = useAddCourseMutation();
  const [loader, setLoader] = useState(false);
  const dialogContentRef = useRef<HTMLDivElement | null>(null);
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
            currency: "bdt",
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
      toast("Something went wrong");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <DialogContent ref={dialogContentRef} className="max-w-4xl!">
      <DialogTitle className="mb-4">Add New Course Platform</DialogTitle>
      <div className="max-h-[90vh] overflow-y-auto pr-2">
        <CourseForm
          courseData={courseData}
          setCourseData={setCourseData}
          handleSubmit={handleSubmit}
          loader={loader}
          formType="insert"
          popoverContainer={dialogContentRef.current}
        />
      </div>
    </DialogContent>
  );
};

export default CourseInsert;
