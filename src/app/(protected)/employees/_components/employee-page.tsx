"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import UserInfo from "@/components/user-info";
import { employeeInfoById } from "@/lib/employee-info";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";

const EmployeePage = ({
  employees,
}: {
  employees: (TEmployee & { department: string; designation: string })[];
}) => {
  return employees?.map((employee, index) => (
    <TableRow key={`employee-${index}`}>
      <TableCell className="min-w-[200px]">
        <UserInfo
          user={employeeInfoById(employee.id)}
          link={`/employees/${employee.id}`}
        />
      </TableCell>
      <TableCell>{employee.work_email}</TableCell>
      <TableCell>{employee.phone}</TableCell>
      <TableCell className="capitalize">{employee.department}</TableCell>
      <TableCell className="capitalize text-left">
        {employee.designation}
      </TableCell>
    </TableRow>
  ));
};

export default EmployeePage;
