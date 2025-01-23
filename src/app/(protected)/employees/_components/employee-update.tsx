import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateEmployeeMutation } from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { ExternalLinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import EmployeeForm from "./employee-form";

const EmployeeUpdate = ({
  employee,
  onDialogChange,
}: {
  employee: TEmployee;
  onDialogChange: (open: boolean) => void;
}) => {
  const [loader, setLoader] = useState(false);
  const [employeeData, setEmployeeData] = useState<Partial<TEmployee>>({
    id: employee?.id,
    name: "",
    image: "",
    work_email: "",
    personal_email: "",
    dob: new Date(),
    nid: "",
    tin: "",
    phone: "",
    gender: "",
    blood_group: "",
    marital_status: "",
    present_address: "",
    permanent_address: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    note: "",
    status: "",
    role: "",
  });

  const { toast } = useToast();
  const [updateProduct, { isSuccess, isError, error }] =
    useUpdateEmployeeMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    updateProduct(employeeData as TEmployee);
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      toast({
        title: "Product updated complete",
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
      <DialogTitle className="mb-4 capitalize">
        Update {employee?.name} (
        <a
          target="_blank"
          rel="noreferrer noopener"
          href={`https://uihut.com/employees/${employee?.id}`}
        >
          {employee?.id}{" "}
          <ExternalLinkIcon className="w-5 h-5 align-bottom inline-block" />
        </a>
        )
      </DialogTitle>
      <EmployeeForm
        handleSubmit={handleSubmit}
        employeeData={employeeData}
        setEmployeeData={setEmployeeData}
        formType="update"
        loader={loader}
      />
    </DialogContent>
  );
};

export default EmployeeUpdate;
