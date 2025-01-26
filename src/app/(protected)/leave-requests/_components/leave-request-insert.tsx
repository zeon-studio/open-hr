import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAddLeaveRequestMutation } from "@/redux/features/leaveRequestApiSlice/leaveRequestSlice";
import { TLeaveRequest } from "@/redux/features/leaveRequestApiSlice/leaveRequestType";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LeaveRequestForm from "./leave-request-form";

const LeaveRequestInsert = ({
  onDialogChange,
}: {
  onDialogChange: (open: boolean) => void;
}) => {
  const { data } = useSession();
  const [addLeaveRequest, { isSuccess, isError }] =
    useAddLeaveRequestMutation();
  const [loader, setLoader] = useState(false);
  const [leaveRequestData, setLeaveRequestData] = useState<TLeaveRequest>({
    employee_id: data?.user?.id!,
    leave_type: "casual",
    start_date: new Date(),
    end_date: new Date(),
    reason: "",
    status: "pending",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      addLeaveRequest(leaveRequestData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      setLeaveRequestData({
        employee_id: data?.user?.id!,
        leave_type: "casual",
        start_date: new Date(),
        end_date: new Date(),
        reason: "",
        status: "pending",
      });
      toast("LeaveRequest added complete");
      // close modal/dialog
      onDialogChange(false);
    } else if (isError) {
      setLoader(false);
      toast("something went wrong");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <DialogContent
      className="max-w-md"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Leave Request</DialogTitle>
      <LeaveRequestForm
        leaveRequestData={leaveRequestData}
        setLeaveRequestData={setLeaveRequestData}
        handleSubmit={handleSubmit}
        loader={loader}
      />
    </DialogContent>
  );
};

export default LeaveRequestInsert;
