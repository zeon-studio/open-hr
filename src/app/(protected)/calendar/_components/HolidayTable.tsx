import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dateFormat } from "@/lib/dateFormat";
import { TEvent } from "@/redux/features/calendarApiSlice/calendarType";

const HolidayTable = ({
  calendar,
  reason,
}: {
  calendar: TEvent[];
  reason: string;
}) => {
  return (
    <Table className="rounded-md bg-background overflow-hidden">
      <TableHeader className="bg-dark">
        <TableRow className="hover:bg-dark">
          <TableHead className="text-white">{reason}</TableHead>
          <TableHead className="w-[20%] text-white">Start</TableHead>
          <TableHead className="w-[20%] text-white">End</TableHead>
          <TableHead className="w-[10%] text-white">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calendar?.length > 0 &&
          calendar?.map((el: TEvent, i: number) => (
            <TableRow key={i} className="border-none">
              <TableCell>{el?.reason}</TableCell>
              <TableCell>{dateFormat(el?.start_date)}</TableCell>
              <TableCell>{dateFormat(el?.end_date)}</TableCell>
              <TableCell>
                {el?.day_count} {el?.day_count > 1 ? "days" : "day"}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default HolidayTable;
