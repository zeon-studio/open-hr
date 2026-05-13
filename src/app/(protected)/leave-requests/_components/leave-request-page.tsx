"use client";

import ConfirmationPopup from "@/components/confirmation-popup";
import UserInfo from "@/components/user-info";
import {
  useUpdateLeaveRequestMutation,
  type TLeaveRequest,
} from "@/features/leave-request";
import { dateFormat } from "@/lib";
import { employeeInfoById } from "@/lib";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Dialog, DialogTrigger } from "@/ui/dialog";
import { TableCell, TableRow } from "@/ui/table";
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
      <TableCell className="min-w-50">
        <UserInfo user={employeeInfoById(item.employee_id)} />
      </TableCell>
      <TableCell>{item.leave_type}</TableCell>
      <TableCell className="whitespace-nowrap">
        {dateFormat(item.start_date, 6, false, true)}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {dateFormat(item.end_date, 6, false, true)}
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
