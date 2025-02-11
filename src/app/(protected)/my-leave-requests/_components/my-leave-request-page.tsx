"use client";

import ConfirmationPopup from "@/components/confirmation-popup";
import { dateFormat } from "@/lib/date-converter";
import { useDeleteLeaveRequestMutation } from "@/redux/features/leaveRequestApiSlice/leaveRequestSlice";
import { TLeaveRequest } from "@/redux/features/leaveRequestApiSlice/leaveRequestType";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Dialog, DialogTrigger } from "@/ui/dialog";
import { TableCell, TableRow } from "@/ui/table";
import { toast } from "sonner";

const MyLeaveRequestPage = ({
  leaveRequest,
}: {
  leaveRequest: TLeaveRequest[];
}) => {
  const [deleteLeaveRequest] = useDeleteLeaveRequestMutation();

  const handleLeaveRequestDelete = async (item: TLeaveRequest) => {
    deleteLeaveRequest(item._id);
    toast(`Leave request deleted`);
  };

  return (
    <>
      {leaveRequest?.map((item) => (
        <TableRow key={item._id}>
          <TableCell className="capitalize font-medium">
            {item.leave_type}
          </TableCell>
          <TableCell>{dateFormat(item.start_date)}</TableCell>
          <TableCell>{dateFormat(item.end_date)}</TableCell>
          <TableCell>{item.day_count}</TableCell>
          <TableCell>{item.reason}</TableCell>
          <TableCell className="text-right">
            {item.status === "pending" ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="px-4" variant={"destructive"} size={"xs"}>
                    Delete
                  </Button>
                </DialogTrigger>
                <ConfirmationPopup
                  handleConfirmation={() => handleLeaveRequestDelete(item)}
                />
              </Dialog>
            ) : (
              <Badge
                variant={item.status === "rejected" ? "destructive" : "success"}
              >
                {item.status}
              </Badge>
            )}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default MyLeaveRequestPage;
