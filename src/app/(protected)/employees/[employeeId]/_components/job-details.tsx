import { Card, CardContent } from "@/components/ui/card";
import { getDuration } from "@/lib/dateFormat";
import { useGetEmployeeJobQuery } from "@/redux/features/employeeJobApiSlice/employeeJobSlice";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import JobInformation from "./job-information";
import PreviousJobs from "./previous-jobs";

export default function JobDetails() {
  const { data: session } = useSession();

  let { employeeId } = useParams<{ employeeId: string }>();
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }

  const { data, isLoading } = useGetEmployeeJobQuery(employeeId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className={"py-20"}>
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin size-5" />
          </div>
        </CardContent>
      </Card>
    );
  }
  const employmentDuration = getDuration(
    data?.result?.joining_date!,
    new Date().toISOString()
  );

  const formattedDuration = `${employmentDuration.years || 0}y - ${employmentDuration.months || 0}m - ${employmentDuration.days || 0}d`;

  return (
    <div className="space-y-8">
      <JobInformation
        company_name={data?.result?.company_name!}
        company_website={data?.result?.company_website!}
        employeeId={employeeId}
        formattedDuration={formattedDuration}
        joining_date={data?.result?.joining_date!}
        promotions={data?.result.promotions!}
        employee={data?.result!}
      />

      <PreviousJobs
        employee={data?.result!}
        prev_jobs={
          data?.result.prev_jobs ?? [
            {
              company_name: "",
              company_website: "",
              designation: "",
              end_date: "" as any,
              job_type: "" as any,
              start_date: "" as any,
            },
          ]
        }
      />
    </div>
  );
}
