import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserInfo from "@/components/UserInfo";
import { dateFormat } from "@/lib/dateFormat";
import { getEmployeeInfo } from "@/lib/employeeId2Info";
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
      <CardHeader>
        <CardTitle>Who's Out</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h4 className="h6 mb-3">Today</h4>
          {todaysLeave?.length === 0 ? (
            <p className="text-text-light">
              Nobody requested time off for today
            </p>
          ) : (
            <ul className="space-y-3">
              {todaysLeave?.map((leave: any) => (
                <li key={leave._id}>
                  <UserInfo
                    user={getEmployeeInfo(leave.employee_id)!}
                    description={`${dateFormat(leave.start_date)} - ${dateFormat(leave.end_date)}`}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-6">
          <h4 className="h6 mb-3">Tomorrow</h4>
          {todaysLeave?.length === 0 ? (
            <p className="text-text-light">
              Nobody requested time off for tomorrow
            </p>
          ) : (
            <ul className="space-y-3">
              {todaysLeave?.map((leave: any) => (
                <li key={leave._id}>
                  <UserInfo
                    user={getEmployeeInfo(leave.employee_id)!}
                    description={`${dateFormat(leave.start_date)} - ${dateFormat(leave.end_date)}`}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-6">
          <h4 className="h6 mb-3">Upcoming Leaves</h4>
          {todaysLeave?.length === 0 ? (
            <p className="text-text-light">
              Nobody requested time off for upcoming days
            </p>
          ) : (
            <ul className="space-y-3">
              {todaysLeave?.map((leave: any) => (
                <li key={leave._id}>
                  <UserInfo
                    user={getEmployeeInfo(leave.employee_id)!}
                    description={`${dateFormat(leave.start_date)} - ${dateFormat(leave.end_date)}`}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingLeaves;
