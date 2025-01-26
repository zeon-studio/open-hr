"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { TLeaveYear } from "@/redux/features/leaveApiSlice/leaveType";

const EmployeeLeavePage = ({ leave }: { leave: TLeaveYear[] }) => {
  return (
    <>
      {leave?.map((item) => (
        <TableRow key={item.year}>
          <TableCell className="border-r">{item.year}</TableCell>
          <TableCell className="text-center">{item.casual.allotted}</TableCell>
          <TableCell className="text-center">{item.casual.consumed}</TableCell>
          <TableCell className="text-center border-r">
            {item.casual.allotted - item.casual.consumed}
          </TableCell>
          <TableCell className="text-center">{item.earned.allotted}</TableCell>
          <TableCell className="text-center">{item.earned.consumed}</TableCell>
          <TableCell className="text-center border-r">
            {item.earned.allotted - item.earned.consumed}
          </TableCell>
          <TableCell className="text-center">{item.sick.allotted}</TableCell>
          <TableCell className="text-center">{item.sick.consumed}</TableCell>
          <TableCell className="text-center border-r">
            {item.sick.allotted - item.sick.consumed}
          </TableCell>
          <TableCell className="text-center">
            {item.without_pay.allotted}
          </TableCell>
          <TableCell className="text-center">
            {item.without_pay.consumed}
          </TableCell>
          <TableCell className="text-center border-r">
            {item.without_pay.allotted - item.without_pay.consumed}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default EmployeeLeavePage;
