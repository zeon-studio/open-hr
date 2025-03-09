import { useGetPayrollQuery } from "@/redux/features/payrollApiSlice/payrollSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function Payroll() {
  const { data: session } = useSession();
  const params = useParams<{ employeeId: string }>();
  let employeeId = params?.employeeId ?? "";
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }
  const { data, isLoading } = useGetPayrollQuery(employeeId);

  return (
    <div className="space-y-10">
      {/* Increments */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b-transparent">
          <CardTitle>Increments</CardTitle>
        </CardHeader>
        <CardContent
          className={
            isLoading || !data?.result! ? "py-20" : "overflow-hidden pt-0"
          }
        >
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin size-5" />
            </div>
          ) : data?.result?.increments?.length! > 0 ? (
            <div className="flex flex-col gap-4">
              <ul className="space-y-3">
                {data?.result?.increments.map((increment, index) => (
                  <li
                    className="row !mx-0 space-y-3 xl:space-y-0 xl:row-cols-3 items-center bg-light rounded py-3"
                    key={`increment-${index}`}
                  >
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Reason
                      </small>
                      <strong className="text-sm font-medium capitalize">
                        {increment.reason}
                      </strong>
                    </div>
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Amount
                      </small>
                      <strong className="text-sm font-medium capitalize">
                        {increment.amount} BDT
                      </strong>
                    </div>
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Date:
                      </small>
                      <strong className="text-sm font-medium capitalize">
                        {increment.date &&
                          format(new Date(increment.date), "MMM d, yyyy")}
                      </strong>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <p className="text-center text-muted-foreground">No Data Found</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Bonus */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b-transparent">
          <CardTitle>Bonus</CardTitle>
        </CardHeader>
        <CardContent
          className={
            isLoading || !data?.result! ? "py-20" : "overflow-hidden pt-0"
          }
        >
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin size-5" />
            </div>
          ) : data?.result?.bonus?.length! > 0 ? (
            <div className="flex flex-col gap-4">
              <ul className="space-y-3">
                {data?.result?.bonus.map((bonus, index) => (
                  <li
                    className="row !mx-0 space-y-3 xl:space-y-0 xl:row-cols-3 items-center bg-light rounded py-3"
                    key={`bonus-${index}`}
                  >
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Amount
                      </small>
                      <strong className="text-sm font-medium capitalize">
                        {bonus.amount} BDT
                      </strong>
                    </div>
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Type:
                      </small>
                      <strong className="text-sm font-medium capitalize">
                        {bonus.type}
                      </strong>
                    </div>
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Date:
                      </small>
                      <strong className="text-sm font-medium capitalize">
                        {bonus.date &&
                          format(new Date(bonus.date), "MMM d, yyyy")}
                      </strong>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <p className="text-center text-muted-foreground">No Data Found</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Salary */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b-transparent">
          <CardTitle>Salary</CardTitle>
        </CardHeader>
        <CardContent
          className={
            isLoading || !data?.result! ? "py-20" : "overflow-hidden pt-0"
          }
        >
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin size-5" />
            </div>
          ) : data?.result?.salary?.length! > 0 ? (
            <div className="flex flex-col gap-4">
              <ul className="space-y-3">
                {data?.result?.salary.map((salary, index) => (
                  <li
                    className="row !mx-0 space-y-3 xl:space-y-0 xl:row-cols-2 items-center bg-light rounded py-3"
                    key={`salary-${index}`}
                  >
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Amount
                      </small>
                      <strong className="text-sm font-medium capitalize">
                        {salary.amount} BDT
                      </strong>
                    </div>
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Date:
                      </small>
                      <strong className="text-sm font-medium capitalize">
                        {salary.date &&
                          format(new Date(salary.date), "MMM d, yyyy")}
                      </strong>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <p className="text-center text-muted-foreground">No Data Found</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
