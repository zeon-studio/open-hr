"use client";
import Avatar from "@/components/Avatar";
import { buttonVariants } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import Link from "next/link";

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
            <div className="flex items-center space-x-2">
              <Avatar
                width={50}
                height={50}
                src={employee?.image}
                email={employee.work_email}
                alt={employee.name}
              />
              <Link
                className={buttonVariants({
                  variant: "link",
                })}
                href={`/employees/${employee.id}`}
              >
                {employee.name}
              </Link>
            </div>
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
