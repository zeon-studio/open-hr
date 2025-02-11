import { TLeaveYear } from "@/redux/features/leaveApiSlice/leaveType";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Loader2 } from "lucide-react";
import { SetStateAction } from "react";

const LeaveForm = ({
  leaveData,
  setLeaveData,
  handleSubmit,
  loader,
}: {
  leaveData: Partial<TLeaveYear>;
  setLeaveData: SetStateAction<any>;
  handleSubmit: (e: any) => Promise<void>;
  loader: boolean;
}) => {
  return (
    <form className="row justify-between items-center" onSubmit={handleSubmit}>
      <div className="lg:col-6 mb-4">
        <Label>Casual Alloted</Label>
        <Input
          type="text"
          value={leaveData.casual?.allotted!}
          onChange={(e: any) =>
            setLeaveData({
              ...leaveData,
              casual: { ...leaveData.casual, allotted: e.target.value },
            })
          }
          required
        />
      </div>
      <div className="lg:col-6 mb-4">
        <Label>Casual Consumed</Label>
        <Input
          type="text"
          value={leaveData.casual?.consumed!}
          onChange={(e: any) =>
            setLeaveData({
              ...leaveData,
              casual: { ...leaveData.casual, consumed: e.target.value },
            })
          }
          required
        />
      </div>

      <div className="lg:col-6 mb-4">
        <Label>Earned Alloted</Label>
        <Input
          type="text"
          value={leaveData.earned?.allotted!}
          onChange={(e: any) =>
            setLeaveData({
              ...leaveData,
              earned: { ...leaveData.earned, allotted: e.target.value },
            })
          }
          required
        />
      </div>
      <div className="lg:col-6 mb-4">
        <Label>Earned Consumed</Label>
        <Input
          type="text"
          value={leaveData.earned?.consumed!}
          onChange={(e: any) =>
            setLeaveData({
              ...leaveData,
              earned: { ...leaveData.earned, consumed: e.target.value },
            })
          }
          required
        />
      </div>

      <div className="lg:col-6 mb-4">
        <Label>Sick Alloted</Label>
        <Input
          type="text"
          value={leaveData.sick?.allotted!}
          onChange={(e: any) =>
            setLeaveData({
              ...leaveData,
              sick: { ...leaveData.sick, allotted: e.target.value },
            })
          }
          required
        />
      </div>
      <div className="lg:col-6 mb-4">
        <Label>Sick Consumed</Label>
        <Input
          type="text"
          value={leaveData.sick?.consumed!}
          onChange={(e: any) =>
            setLeaveData({
              ...leaveData,
              sick: { ...leaveData.sick, consumed: e.target.value },
            })
          }
          required
        />
      </div>

      <div className="lg:col-6 mb-4">
        <Label>Without Pay Alloted</Label>
        <Input
          type="text"
          value={leaveData.without_pay?.allotted!}
          onChange={(e: any) =>
            setLeaveData({
              ...leaveData,
              without_pay: {
                ...leaveData.without_pay,
                allotted: e.target.value,
              },
            })
          }
          required
        />
      </div>
      <div className="lg:col-6 mb-4">
        <Label>Without Pay Alloted</Label>
        <Input
          type="text"
          value={leaveData.without_pay?.consumed!}
          onChange={(e: any) =>
            setLeaveData({
              ...leaveData,
              without_pay: {
                ...leaveData.without_pay,
                consumed: e.target.value,
              },
            })
          }
          required
        />
      </div>

      <div className="col-12 text-right">
        <Button type="submit" disabled={loader}>
          {loader ? (
            <>
              Please wait
              <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
            </>
          ) : (
            "Update Leave"
          )}
        </Button>
      </div>
    </form>
  );
};

export default LeaveForm;
