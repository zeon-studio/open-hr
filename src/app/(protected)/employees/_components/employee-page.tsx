"use client";

import ConfirmationPopup from "@/components/confirmation-popup";
import UserInfo from "@/components/user-info";
import { employeeInfoById } from "@/lib/employee-info";
import { useDeleteEmployeeMutation } from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { TableCell, TableRow } from "@/ui/table";
import { Ellipsis } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import EmployeeAppointmentLetter, {
  getAppointmentLetterHtml,
} from "./employee-appointment-letter";
import EmployeeEmploymentCertificate, {
  getEmploymentCertificateHtml,
} from "./employee-employment-certificate";

const EmployeePage = ({ employees }: { employees: TEmployee[] }) => {
  const { data: session } = useSession();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [printContent, setPrintContent] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only print when printContent is set and on client
  useEffect(() => {
    if (printContent && isClient) {
      // Remove all but the first .print-area before printing
      setTimeout(() => {
        const printAreas = document.querySelectorAll(".print-area");
        if (printAreas.length > 1) {
          printAreas.forEach((el, idx) => {
            if (idx > 0) el.parentNode?.removeChild(el);
          });
        }
        window.print();
        setPrintContent(null);
      }, 300);
    }
  }, [printContent, isClient]);

  // delete employee
  const handleEmployeeDelete = (employee_id: string) => {
    deleteEmployee(employee_id);
    toast("Employee deleted complete");
  };

  const handlePrint = (htmlContent: string) => {
    setPrintContent(htmlContent);
  };

  return (
    <>
      {/* Hidden print area using portal to avoid duplicate rendering */}
      {isClient &&
        createPortal(
          <div
            ref={printRef}
            className="print-area"
            id="print-area"
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              width: "100vw",
              minHeight: "100vh",
              zIndex: 9999,
              background: "#fff",
              padding: 0,
              display: printContent ? "flex" : "none",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                maxWidth: 600,
                margin: "auto",
                fontSize: "1.15rem",
                lineHeight: 1.7,
                color: "#222",
              }}
              dangerouslySetInnerHTML={{ __html: printContent || "" }}
            />
          </div>,
          typeof window !== "undefined" ? document.body : ({} as HTMLElement)
        )}

      {/* employees map */}
      {employees?.map((employee, index) => {
        return (
          <TableRow key={`employee-${index}`}>
            <TableCell className="min-w-[200px]">
              <UserInfo user={employeeInfoById(employee.id)} />
            </TableCell>
            <TableCell className="capitalize">
              {employee.department?.split("_").join(" & ")}
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
                    <ul>
                      <li>
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
                      </li>
                      <li>
                        <DropdownMenuItem asChild>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                className="w-full justify-start"
                                variant="ghost"
                                size="sm"
                              >
                                Appointment Letter
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <h3 className="text-lg font-semibold mb-2">
                                Appointment Letter
                              </h3>
                              <EmployeeAppointmentLetter employee={employee} />
                              <Button
                                className="mt-4"
                                onClick={() =>
                                  handlePrint(
                                    getAppointmentLetterHtml(employee)
                                  )
                                }
                              >
                                Print
                              </Button>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                      </li>
                      <li>
                        <DropdownMenuItem asChild>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                className="w-full justify-start"
                                variant="ghost"
                                size="sm"
                              >
                                Employment Certificate
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <h3 className="text-lg font-semibold mb-2">
                                Employment Certificate
                              </h3>
                              <EmployeeEmploymentCertificate
                                employee={employee}
                              />
                              <Button
                                className="mt-4"
                                onClick={() =>
                                  handlePrint(
                                    getEmploymentCertificateHtml(employee)
                                  )
                                }
                              >
                                Print
                              </Button>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                      </li>
                    </ul>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            )}
          </TableRow>
        );
      })}
    </>
  );
};

export default EmployeePage;
