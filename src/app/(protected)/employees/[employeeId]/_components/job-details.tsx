import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDuration } from "@/lib/dateFormat";
import { useGetEmployeeJobQuery } from "@/redux/features/employeeJobApiSlice/employeeJobSlice";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function JobDetails() {
  const { data: session } = useSession();
  const user = session?.user;
  const { data, isLoading } = useGetEmployeeJobQuery(user?.id!, {
    skip: !user?.id,
  });

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
    data?.result.joining_date!,
    new Date().toISOString()
  );
  const formattedDuration = `${employmentDuration.years || 0}y - ${employmentDuration.months || 0}m - ${employmentDuration.days || 0}d`;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="border-b-transparent pb-0">
          <CardTitle>Job Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ul
            style={
              {
                "--space": "15px",
              } as React.CSSProperties
            }
            className="space-y-[--space] "
          >
            <li className="flex space-x-4">
              <Image
                className="rounded"
                src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${data?.result.company_website}&size=64`}
                width={48}
                height={48}
                alt={data?.result.company_name ?? "brand logo"}
              />
              <div className="space-y-1 items-center">
                <p className="text-text-dark font-semibold text-sm capitalize">
                  {data?.result.company_name}
                </p>
                <p className="text-text-light font-semibold text-xs">
                  {formattedDuration}
                </p>
              </div>
            </li>
            {data?.result.promotions.map((promotion, index, promotions) => {
              const startDate =
                index === promotions.length - 1
                  ? data.result.joining_date // If it's the last promotion, use joining date
                  : promotions[index + 1].promotion_date; // Otherwise, use the next promotion's date as the start date

              const employmentDuration = getDuration(
                startDate,
                promotion.promotion_date
              );

              const formattedDuration = `${employmentDuration.years || 0}y - ${employmentDuration.months || 0}m - ${employmentDuration.days || 0}d`;

              return (
                <li className="flex space-x-4 group" key={index}>
                  <div className="size-[48px] relative after:absolute after:size-2 after:rounded-full after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-muted before:absolute before:w-0.5 before:h-[calc(100%_-_2px)] before:bg-muted before:top-[calc(100%_-_var(--space))] before:left-1/2 before:-translate-x-1/2 group-last:before:hidden before:rounded-full" />
                  <div className="space-y-1 items-center">
                    <p className="text-text-dark font-semibold text-sm">
                      {promotion.designation}
                    </p>
                    <p className="text-text-light font-semibold text-xs">
                      {formattedDuration}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-transparent pb-0">
          <CardTitle>Previous jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {data?.result.prev_jobs.map((job, index, jobs) => {
              const employmentDuration = getDuration(
                job.start_date,
                job.end_date
              );
              const formattedDuration = `${employmentDuration.years || 0}y - ${employmentDuration.months || 0}m - ${employmentDuration.days || 0}d`;

              return (
                <li className="flex space-x-4 group items-center" key={index}>
                  <Image
                    className="rounded size-[48px] flex-none"
                    src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${job.company_website}&size=64`}
                    width={48}
                    height={48}
                    alt={job.company_name ?? "brand logo"}
                  />
                  <div className="space-y-1 items-center">
                    <p className="text-text-dark font-semibold text-sm">
                      {job.designation}
                    </p>
                    <p className="text-text-light font-semibold text-xs capitalize">
                      <span>{job.company_name} </span>

                      <span>&bull; {job.job_type.replace("_", " ")}</span>
                    </p>
                    <p className="text-text-light font-semibold text-xs">
                      {formattedDuration}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
