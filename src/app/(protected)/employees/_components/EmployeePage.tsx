"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { useDialog } from "@/hooks/useDialog";
import { dateFormat } from "@/lib/dateFormat";
import { useGetEmployeeQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { memo, useMemo, useState } from "react";
import EmployeeUpdate from "./EmployeeUpdate";

const EmployeePage = ({ employees }: { employees: TEmployee[] }) => {
  const [id, setId] = useState<string>("");

  return (
    <>
      {employees?.map((employee: TEmployee) => (
        <MemoizedEmployeeModal
          id={id}
          setId={setId}
          key={employee.id}
          employee={employee}
        />
      ))}
    </>
  );
};

export default EmployeePage;

const EmployeeModal = ({
  employee,
  id,
  setId,
}: {
  employee: TEmployee;
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { isDialogOpen, onDialogChange } = useDialog();

  const { data: employeeData } = useGetEmployeeQuery(id || "", {
    skip: id !== employee?.id,
  });

  const singleEmployee = useMemo(() => employeeData?.result, [employeeData]);

  return (
    <Dialog
      key={employee?.id}
      modal={true}
      open={isDialogOpen}
      onOpenChange={onDialogChange}
    >
      <DialogTrigger asChild onClick={() => setId(employee?.id)}>
        <TableRow className="cursor-pointer">
          <TableCell className="capitalize">{employee?.name}</TableCell>
          <TableCell>{employee?.work_email}</TableCell>
          <TableCell>{employee?.phone}</TableCell>
          <TableCell>{employee?.role}</TableCell>
          <TableCell>{dateFormat(employee?.createdAt)}</TableCell>
        </TableRow>
      </DialogTrigger>
      {singleEmployee?.id && (
        <EmployeeUpdate
          employee={singleEmployee!}
          onDialogChange={onDialogChange}
        />
      )}
    </Dialog>
  );
};

const MemoizedEmployeeModal = memo(EmployeeModal);
