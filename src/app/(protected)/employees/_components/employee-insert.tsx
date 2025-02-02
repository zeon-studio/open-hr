import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAddEmployeeMutation } from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployeeCreate } from "@/redux/features/employeeApiSlice/employeeType";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmployeeInsertForm from "./employee-insert-form";

const initialEmployeeData = {
  personal_email: "",
  department: "" as any,
  job_type: "" as any,
  joining_date: new Date(),
  designation: "",
  manager_id: "",
};

const EmployeeInsert = ({
  onDialogChange,
}: {
  onDialogChange: (open: boolean) => void;
}) => {
  const [loader, setLoader] = useState(false);
  const [employeeData, setEmployeeData] =
    useState<TEmployeeCreate>(initialEmployeeData);

  const [addEmployee, { isSuccess, isError, error }] = useAddEmployeeMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      // @ts-ignore
      addEmployee(employeeData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      setEmployeeData(initialEmployeeData);
      // close modal/dialog
      onDialogChange(false);
      toast("Employee added successfully");
    } else if (isError) {
      setLoader(false);
      toast("something went wrong");
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <DialogContent
      className="max-w-2xl overflow-y-auto max-h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Add New Employee</DialogTitle>
      <EmployeeInsertForm
        handleSubmit={handleSubmit}
        employeeData={employeeData}
        setEmployeeData={setEmployeeData}
        loader={loader}
      />
    </DialogContent>
  );
};

export default EmployeeInsert;
