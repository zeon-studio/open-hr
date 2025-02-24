"use client";

import UserInfo from "@/components/user-info";
import { useDialog } from "@/hooks/useDialog";
import { employeeInfoById } from "@/lib/employee-info";
import { TLeaveYear } from "@/redux/features/leaveApiSlice/leaveType";
import { Button } from "@/ui/button";
import { Dialog, DialogTrigger } from "@/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { TableCell, TableRow } from "@/ui/table";
import { Ellipsis } from "lucide-react";
import { memo, useMemo, useState } from "react";
import LeaveUpdate from "./leave-update";

const LeavePage = ({
  leave,
  casualEnabled,
  sickEnabled,
  earnedEnabled,
  withoutPayEnabled,
}: {
  leave: TLeaveYear[];
  casualEnabled: boolean;
  sickEnabled: boolean;
  earnedEnabled: boolean;
  withoutPayEnabled: boolean;
}) => {
  const [leaveId, setLeaveId] = useState<string>("");

  return (
    <>
      {leave?.map((item) => (
        <MemoizedLeaveModal
          key={item.employee_id}
          leaveId={leaveId}
          setLeaveId={setLeaveId}
          item={item}
          casualEnabled={casualEnabled}
          sickEnabled={sickEnabled}
          earnedEnabled={earnedEnabled}
          withoutPayEnabled={withoutPayEnabled}
        />
      ))}
    </>
  );
};

export default LeavePage;

const LeaveModal = ({
  item,
  leaveId,
  setLeaveId,
  casualEnabled,
  sickEnabled,
  earnedEnabled,
  withoutPayEnabled,
}: {
  item: TLeaveYear;
  leaveId: string;
  setLeaveId: React.Dispatch<React.SetStateAction<string>>;
  casualEnabled: boolean;
  sickEnabled: boolean;
  earnedEnabled: boolean;
  withoutPayEnabled: boolean;
}) => {
  const { isDialogOpen, onDialogChange } = useDialog();

  // Simulate fetching leave data
  const singleLeave = useMemo(() => {
    return leaveId === item.employee_id ? item : null;
  }, [leaveId, item]);

  return (
    <DropdownMenu key={item.employee_id}>
      <TableRow>
        <TableCell>
          <UserInfo
            className="min-w-[150px]"
            user={employeeInfoById(item.employee_id!)}
          />
        </TableCell>
        {casualEnabled && (
          <TableCell className="text-center space-x-8 border-l border-border">
            <span className="text-success">{item.casual.allotted}</span>
            <span className="text-destructive">{item.casual.consumed}</span>
            <span className="text-accent">
              {item.casual.allotted - item.casual.consumed}
            </span>
          </TableCell>
        )}
        {sickEnabled && (
          <TableCell className="text-center space-x-8 border-l border-border">
            <span className="text-success">{item.sick.allotted}</span>
            <span className="text-destructive">{item.sick.consumed}</span>
            <span className="text-accent">
              {item.sick.allotted - item.sick.consumed}
            </span>
          </TableCell>
        )}
        {earnedEnabled && (
          <TableCell className="text-center space-x-8 border-l border-border">
            <span className="text-success">{item.earned.allotted}</span>
            <span className="text-destructive">{item.earned.consumed}</span>
            <span className="text-accent">
              {item.earned.allotted - item.earned.consumed}
            </span>
          </TableCell>
        )}
        {withoutPayEnabled && (
          <TableCell className="text-center space-x-8 border-l border-border">
            <span className="text-success">{item.without_pay.allotted}</span>
            <span className="text-destructive">
              {item.without_pay.consumed}
            </span>
            <span className="text-accent">
              {item.without_pay.allotted - item.without_pay.consumed}
            </span>
          </TableCell>
        )}
        <TableCell className="text-right border-l border-border">
          <DropdownMenuTrigger>
            <Ellipsis className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* edit */}
            <DropdownMenuItem asChild>
              <Dialog
                modal={true}
                open={isDialogOpen}
                onOpenChange={onDialogChange}
              >
                <DialogTrigger
                  asChild
                  onClick={() => setLeaveId(item?.employee_id!)}
                >
                  <Button
                    className="w-full justify-start"
                    variant={"ghost"}
                    size={"sm"}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                {singleLeave && (
                  <LeaveUpdate
                    leave={singleLeave!}
                    onDialogChange={onDialogChange}
                  />
                )}
              </Dialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </TableCell>
      </TableRow>
    </DropdownMenu>
  );
};

const MemoizedLeaveModal = memo(LeaveModal);
