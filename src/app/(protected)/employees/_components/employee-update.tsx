import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDialog } from "@/hooks/useDialog";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { EllipsisVerticalIcon } from "lucide-react";
import EmployeeForm from "./employee-form";

export default function EmployeeUpdateModal({
  employee,
}: {
  employee: TEmployee;
}) {
  const { isDialogOpen, onDialogChange } = useDialog();

  return (
    <Dialog modal open={isDialogOpen} onOpenChange={onDialogChange}>
      <DialogTrigger>
        <EllipsisVerticalIcon />
      </DialogTrigger>

      <DialogContent className="max-w-4xl overflow-y-auto h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>

          <EmployeeForm
            onDialogChange={onDialogChange}
            formType="update"
            data={employee}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
