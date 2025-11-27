"use client";

import ConfirmationPopup from "@/components/confirmation-popup";
import UserInfo from "@/components/user-info";
import { useDialog } from "@/hooks/useDialog";
import { dateFormat } from "@/lib/date-converter";
import { employeeInfoById } from "@/lib/employee-info";
import { useDeletePayrollMutation } from "@/redux/features/payrollApiSlice/payrollSlice";
import { TPayroll } from "@/redux/features/payrollApiSlice/payrollType";
import { Button } from "@/ui/button";
import { Dialog } from "@/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { TableCell, TableRow } from "@/ui/table";
import { Ellipsis } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { toast } from "sonner";
import PayrollPreview from "./payroll-preview";
import PayrollUpdate from "./payroll-update";

const PayrollPage = ({ payroll }: { payroll: TPayroll[] }) => {
  const [payrollId, setPayrollId] = useState<string>("");

  return (
    <>
      {payroll?.map((item) => (
        <MemoizedPayrollModal
          payrollId={payrollId}
          setPayrollId={setPayrollId}
          key={item.employee_id}
          item={item}
        />
      ))}
    </>
  );
};

export default PayrollPage;

const PayrollModal = ({
  item,
  payrollId,
  setPayrollId,
}: {
  item: TPayroll;
  payrollId: string;
  setPayrollId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { isDialogOpen, onDialogChange } = useDialog();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Simulate fetching payroll data
  const singlePayroll = useMemo(() => {
    return payrollId === item.employee_id ? item : null;
  }, [payrollId, item]);

  const [deletePayroll] = useDeletePayrollMutation();

  const handlePayrollDelete = () => {
    deletePayroll(item.employee_id);
    toast("Payroll deleted complete");
  };

  const handleAction = (action: "preview" | "edit" | "delete") => {
    if (!item?.employee_id) return;

    setPayrollId(item.employee_id);
    setIsMenuOpen(false);

    switch (action) {
      case "preview":
        setIsPreviewOpen(true);
        break;
      case "edit":
        onDialogChange(true);
        break;
      case "delete":
        setIsDeleteDialogOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <DropdownMenu
        key={item.employee_id}
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        modal={false}
      >
        <TableRow>
          <TableCell>
            <UserInfo user={employeeInfoById(item.employee_id)} />
          </TableCell>
          <TableCell>{item.gross_salary} BDT</TableCell>
          <TableCell>
            {/* last salary date */}
            {item?.salary[item.salary?.length - 1] &&
              dateFormat(item.salary[item.salary.length - 1]?.date)}
          </TableCell>
          <TableCell className="text-right">
            <DropdownMenuTrigger>
              <Ellipsis className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="p-0">
                <Button
                  className="w-full justify-start"
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => handleAction("preview")}
                >
                  Preview
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Button
                  className="w-full justify-start"
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => handleAction("edit")}
                >
                  Edit
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Button
                  className="w-full text-destructive hover:bg-destructive justify-start"
                  variant={"ghost"}
                  size={"sm"}
                  onClick={() => handleAction("delete")}
                >
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </TableCell>
        </TableRow>
      </DropdownMenu>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        {singlePayroll?.employee_id && (
          <PayrollPreview payrollData={singlePayroll!} />
        )}
      </Dialog>

      <Dialog
        modal={true}
        open={isDialogOpen}
        onOpenChange={(open) => {
          onDialogChange(open);
          if (!open) {
            setPayrollId("");
          }
        }}
      >
        {singlePayroll?.employee_id && (
          <PayrollUpdate
            payroll={singlePayroll!}
            onDialogChange={onDialogChange}
          />
        )}
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        {singlePayroll?.employee_id && (
          <ConfirmationPopup
            handleConfirmation={() => {
              handlePayrollDelete();
              setIsDeleteDialogOpen(false);
            }}
            id={singlePayroll?.employee_id!}
          />
        )}
      </Dialog>
    </>
  );
};

const MemoizedPayrollModal = memo(PayrollModal);
