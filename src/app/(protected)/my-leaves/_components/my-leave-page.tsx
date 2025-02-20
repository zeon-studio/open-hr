"use client";

import { TLeaveYear } from "@/redux/features/leaveApiSlice/leaveType";
import { TableCell, TableRow } from "@/ui/table";

const MyLeavePage = ({ leave }: { leave: TLeaveYear[] }) => {
  return (
    <>
      {leave?.map((item) => (
        <TableRow key={item.year}>
          <TableCell>{item.year}</TableCell>
          <TableCell className="text-center space-x-8 border-l border-border">
            <span className="text-success">{item.casual.allotted}</span>
            <span className="text-destructive">{item.casual.consumed}</span>
            <span className="text-accent">
              {item.casual.allotted - item.casual.consumed}
            </span>
          </TableCell>
          <TableCell className="text-center space-x-8 border-l border-border">
            <span className="text-success">{item.sick.allotted}</span>
            <span className="text-destructive">{item.sick.consumed}</span>
            <span className="text-accent">
              {item.sick.allotted - item.sick.consumed}
            </span>
          </TableCell>
          <TableCell className="text-center space-x-8 border-l border-border">
            <span className="text-success">{item.earned.allotted}</span>
            <span className="text-destructive">{item.earned.consumed}</span>
            <span className="text-accent">
              {item.earned.allotted - item.earned.consumed}
            </span>
          </TableCell>
          <TableCell className="text-center space-x-8 border-l border-border">
            <span className="text-success">{item.without_pay.allotted}</span>
            <span className="text-destructive">
              {item.without_pay.consumed}
            </span>
            <span className="text-accent">
              {item.without_pay.allotted - item.without_pay.consumed}
            </span>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default MyLeavePage;
