import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetEmployeeJobQuery } from "@/redux/features/employeeJobApiSlice/employeeJobSlice";
import { format } from "date-fns";
import { EllipsisIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export default function JobDetails() {
  const { data: session } = useSession();
  const user = session?.user;
  const { data } = useGetEmployeeJobQuery(user?.id!, {
    skip: !user?.id,
  });

  return (
    <div>
      <Card>
        <CardHeader className="border-b-transparent">
          <CardTitle>Employment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-accent hover:bg-accent rounded-t-md rounded">
              <TableRow className="hover:bg-accent border-b-transparent rounded-lg overflow-hidden">
                <TableHead className="text-text-dark font-semibold">
                  Joining Date
                </TableHead>
                <TableHead className="text-text-dark font-semibold">
                  Permanent Date
                </TableHead>
                <TableHead className="text-text-dark font-semibold">
                  Designation
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-transparent border-transparent">
                <TableCell className="font-medium">
                  {data?.result.joining_date
                    ? format(new Date(data?.result.joining_date), "MMM d, yyyy")
                    : null}
                </TableCell>
                <TableCell>
                  {data?.result.permanent_date
                    ? format(
                        new Date(data?.result.permanent_date),
                        "MMM d, yyyy"
                      )
                    : null}
                </TableCell>
                <TableCell>{data?.result.designation}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger>
                      <EllipsisIcon />
                    </PopoverTrigger>
                    <PopoverContent>fasj</PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b-transparent">
          <CardTitle>Job Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex space-x-4">
              <Image
                className="rounded"
                src={"/images/brand-logo.png"}
                width={48}
                height={48}
                alt="brand-logo"
              />
              <div className="space-y-1 items-center">
                <p className="text-text-dark font-semibold text-sm">
                  Themefisher
                </p>
                <p className="text-text-light font-semibold text-xs">
                  3 yrs 6 mon
                </p>
              </div>
            </li>
            <li className="flex space-x-4">
              <div className="size-[48px]" />
              <div className="space-y-1 items-center">
                <p className="text-text-dark font-semibold text-sm">
                  Marketing Manager
                </p>
                <p className="text-text-light font-semibold text-xs">
                  Mar 2023 - Present • 1 yr 10 mon
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
