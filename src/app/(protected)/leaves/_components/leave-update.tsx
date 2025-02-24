import { useUpdateLeaveMutation } from "@/redux/features/leaveApiSlice/leaveSlice";
import { TLeaveYear } from "@/redux/features/leaveApiSlice/leaveType";
import { DialogContent, DialogTitle } from "@/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LeaveForm from "./leave-form";

const LeaveUpdate = ({
  leave,
  onDialogChange,
}: {
  leave: TLeaveYear;
  onDialogChange: (open: boolean) => void;
}) => {
  const [loader, setLoader] = useState(false);
  const [leaveData, setLeaveData] = useState({
    employee_id: leave.employee_id,
    year: leave.year,
    casual: leave.casual,
    earned: leave.earned,
    sick: leave.sick,
    without_pay: leave.without_pay,
  });

  const [updateLeave, { isSuccess, isError, error }] = useUpdateLeaveMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    updateLeave(leaveData);
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      toast("Leave Update complete");
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
      <DialogTitle className="mb-4">Update Leave Platform</DialogTitle>
      <LeaveForm
        leaveData={leaveData}
        setLeaveData={setLeaveData}
        handleSubmit={handleSubmit}
        loader={loader}
      />
    </DialogContent>
  );
};

export default LeaveUpdate;
