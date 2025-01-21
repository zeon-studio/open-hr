import { Card, CardContent } from "@/components/ui/card";
import { useGetUpcomingLeaveRequestsQuery } from "@/redux/features/leaveRequestApiSlice/leaveRequestSlice";
import { useMemo } from "react";

const UpcomingLeaves = () => {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = useGetUpcomingLeaveRequestsQuery(today);

  // today leave
  const todaysLeave = useMemo(() => {
    return data?.result?.filter((leave: any) => {
      const start = new Date(leave.start_date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(leave.end_date);
      end.setHours(0, 0, 0, 0);
      const currentDate = new Date(today);
      currentDate.setHours(0, 0, 0, 0);
      return currentDate >= start && currentDate <= end;
    });
  }, [data, today]);

  // tomorrow leave
  const tomorrowsLeave = useMemo(() => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return data?.result?.filter((leave: any) => {
      const start = new Date(leave.start_date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(leave.end_date);
      end.setHours(0, 0, 0, 0);
      const currentDate = new Date(tomorrow);
      currentDate.setHours(0, 0, 0, 0);
      return currentDate >= start && currentDate <= end;
    });
  }, [data, today]);

  // others leave without today and tomorrow
  const othersLeave = useMemo(() => {
    return data?.result?.filter((leave: any) => {
      const start = new Date(leave.start_date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(leave.end_date);
      end.setHours(0, 0, 0, 0);
      const currentDate = new Date(today);
      currentDate.setHours(0, 0, 0, 0);
      return currentDate < start || currentDate > end;
    });
  }, [data, today]);

  return (
    <Card className="mb-4">
      <CardContent>
        <h3 className="widget-title">Today</h3>
      </CardContent>
    </Card>
  );
};

export default UpcomingLeaves;
