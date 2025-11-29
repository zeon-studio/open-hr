import { useAddLeaveRequestMutation } from "@/redux/features/leaveRequestApiSlice/leaveRequestSlice";
import { TLeaveRequest } from "@/redux/features/leaveRequestApiSlice/leaveRequestType";
import { DialogContent, DialogTitle } from "@/ui/dialog";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
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
  const dialogContentRef = useRef<HTMLDivElement | null>(null);
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
      toast("Leave request added successfully");
      // close modal/dialog
      onDialogChange(false);
    } else if (isError) {
      setLoader(false);
      toast("Something went wrong");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <DialogContent ref={dialogContentRef} className="max-w-md!">
      <DialogTitle className="mb-4">Leave Request</DialogTitle>
      <LeaveRequestForm
        leaveRequestData={leaveRequestData}
        setLeaveRequestData={setLeaveRequestData}
        handleSubmit={handleSubmit}
        loader={loader}
        popoverContainer={dialogContentRef.current}
      />
    </DialogContent>
  );
};

export default LeaveRequestInsert;
