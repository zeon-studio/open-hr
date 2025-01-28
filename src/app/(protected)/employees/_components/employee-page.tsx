"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import UserInfo from "@/components/UserInfo";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";

const EmployeePage = ({
  employees,
}: {
  employees: (TEmployee & { department: string; designation: string })[];
}) => {
  return (
    <>
      {employees?.map((employee) => (
        <TableRow key={employee.id}>
          <TableCell className="min-w-[200px]">
            <UserInfo user={employee} link={`/employees/${employee.id}`} />
          </TableCell>
          <TableCell>{employee.work_email}</TableCell>
          <TableCell>{employee.phone}</TableCell>
          <TableCell className="capitalize">{employee.department}</TableCell>
          <TableCell className="capitalize text-left">
            {employee.designation}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default EmployeePage;
