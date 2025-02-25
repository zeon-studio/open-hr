"use client";

import ConfirmationPopup from "@/components/confirmation-popup";
import UserInfo from "@/components/user-info";
import { employeeInfoById } from "@/lib/employee-info";
import { useDeleteEmployeeMutation } from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { Badge } from "@/ui/badge";
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
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const EmployeePage = ({ employees }: { employees: TEmployee[] }) => {
  const { data: session } = useSession();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  // delete employee
  const handleEmployeeDelete = (employee_id: string) => {
    deleteEmployee(employee_id);
    toast("Employee deleted complete");
  };

  return employees?.map((employee, index) => (
    <TableRow key={`employee-${index}`}>
      <TableCell className="min-w-[200px]">
        <UserInfo user={employeeInfoById(employee.id)} />
      </TableCell>
      <TableCell className="capitalize">
        {employeeInfoById(employee.id).department?.split("_").join(" & ")}
      </TableCell>
      <TableCell>{employee.work_email}</TableCell>
      <TableCell>{employee.phone}</TableCell>
      <TableCell>
        <Badge
          variant={
            employee.status === "active"
              ? "success"
              : employee.status === "pending"
                ? "warning"
                : "destructive"
          }
        >
          {employee.status}
        </Badge>
      </TableCell>
      {session?.user?.role === "admin" && (
        <TableCell className="text-right">
          {/* delete */}
          <DropdownMenu key={employee.id}>
            <DropdownMenuTrigger>
              <Ellipsis className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full text-destructive hover:bg-destructive justify-start"
                      variant={"ghost"}
                      size={"sm"}
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <ConfirmationPopup
                    handleConfirmation={() =>
                      handleEmployeeDelete(employee?.id)
                    }
                    id={employee?.id}
                    description="All the data related to this employee will be deleted."
                  />
                </Dialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
    </TableRow>
  ));
};

export default EmployeePage;
