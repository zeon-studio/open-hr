"use client";

import ConfirmationPopup from "@/components/ConfirmationPopup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import UserInfo from "@/components/UserInfo";
import { dateFormat } from "@/lib/dateFormat";
import { employeeInfoById } from "@/lib/employeeInfo";
import { useUpdateLeaveRequestMutation } from "@/redux/features/leaveRequestApiSlice/leaveRequestSlice";
import { TLeaveRequest } from "@/redux/features/leaveRequestApiSlice/leaveRequestType";
import { Check, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { memo } from "react";
import { toast } from "sonner";

const LeaveRequestPage = ({
  leaveRequest,
}: {
  leaveRequest: TLeaveRequest[];
}) => {
  const { data } = useSession();
  return (
    <>
      {leaveRequest?.map((item, index) => (
        <MemoizedLeaveRequestModal
          key={`leave-request-${index}`}
          item={item}
          role={data?.user?.role!}
        />
      ))}
    </>
  );
};

export default LeaveRequestPage;

const LeaveRequestModal = ({
  item,
  role,
}: {
  item: TLeaveRequest;
  role: string;
}) => {
  const [updateLeaveRequest] = useUpdateLeaveRequestMutation();

  const handleLeaveRequestApprove = async (item: TLeaveRequest) => {
    updateLeaveRequest({
      ...item,
      status: "approved",
      response_date: new Date(),
    });
    toast(`Leave request approved`);
  };

  const handleLeaveRequestReject = async (item: TLeaveRequest) => {
    updateLeaveRequest({
      ...item,
      status: "rejected",
      response_date: new Date(),
    });
    toast(`Leave request rejected`);
  };

  return (
    <TableRow key={item._id}>
      <TableCell className="min-w-[200px]">
        <UserInfo user={employeeInfoById(item.employee_id)} />
      </TableCell>
      <TableCell>{item.leave_type}</TableCell>
      <TableCell className="whitespace-nowrap">
        {dateFormat(item.start_date)}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {dateFormat(item.end_date)}
      </TableCell>
      <TableCell>{item.day_count}</TableCell>
      <TableCell>{item.reason}</TableCell>
      <TableCell className="text-right">
        {item.status === "pending" ? (
          role === "admin" ? (
            <div className="space-x-2">
              <Button
                variant={"success"}
                size={"xs"}
                onClick={() => handleLeaveRequestApprove(item)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"destructive"} size={"xs"}>
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <ConfirmationPopup
                  handleConfirmation={() => handleLeaveRequestReject(item)}
                />
              </Dialog>
            </div>
          ) : (
            <Badge variant={"warning"}>{item.status}</Badge>
          )
        ) : (
          <Badge
            variant={item.status === "rejected" ? "destructive" : "success"}
          >
            {item.status}
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
};
const MemoizedLeaveRequestModal = memo(LeaveRequestModal);
