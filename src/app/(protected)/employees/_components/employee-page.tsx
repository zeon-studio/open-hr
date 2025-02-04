"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import UserInfo from "@/components/user-info";
import { employeeInfoById } from "@/lib/employee-info";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";

const EmployeePage = ({ employees }: { employees: TEmployee[] }) => {
  return employees?.map((employee, index) => (
    <TableRow key={`employee-${index}`}>
      <TableCell className="min-w-[200px]">
        <UserInfo user={employeeInfoById(employee.id)} />
      </TableCell>
      <TableCell>{employee.work_email}</TableCell>
      <TableCell>{employee.phone}</TableCell>
      <TableCell className="capitalize">
        {employeeInfoById(employee.id).department}
      </TableCell>
      <TableCell className="capitalize text-left">
        {employeeInfoById(employee.id).designation}
      </TableCell>
    </TableRow>
  ));
};

export default EmployeePage;
