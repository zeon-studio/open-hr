import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useDialog } from "@/hooks/useDialog";
import { getDuration } from "@/lib/dateFormat";
import { useGetEmployeeJobQuery } from "@/redux/features/employeeJobApiSlice/employeeJobSlice";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import EmployeeJobForm from "./job-form";
import PreviousJobs from "./previous-jobs";

export default function JobDetails() {
  const { data: session } = useSession();
  const isUser = session?.user.role === "user";

  let { employeeId } = useParams<{ employeeId: string }>();
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }

  const { data, isLoading } = useGetEmployeeJobQuery(employeeId);

  const { isDialogOpen, onDialogChange } = useDialog();

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
      <Card>
        <CardHeader className="border-b-transparent pb-0 flex-row gap-0 space-y-0">
          <CardTitle>Job Information</CardTitle>
          {!isUser && (
            <Dialog
              modal={true}
              open={isDialogOpen}
              onOpenChange={onDialogChange}
            >
              <DialogTrigger asChild>
                <Button className="ml-auto">Update Job Info</Button>
              </DialogTrigger>
              <EmployeeJobForm
                employeeJob={data?.result!}
                onDialogChange={onDialogChange}
              />
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <ul
            style={
              {
                "--space": "15px",
              } as React.CSSProperties
            }
            className="space-y-[--space]"
          >
            <li className="flex space-x-4">
              {data?.result.company_website && (
                <Image
                  className="rounded"
                  src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${data?.result.company_website}&size=64`}
                  width={48}
                  height={48}
                  alt={data?.result.company_name ?? "brand logo"}
                />
              )}

              <div className="space-y-1 items-center">
                <p className="text-text-dark font-semibold text-sm capitalize">
                  {data?.result.company_name}
                </p>
                <p className="text-text-light font-semibold text-xs">
                  {formattedDuration}
                </p>
              </div>
            </li>
            {data?.result.promotions?.map((promotion, index, promotions) => {
              const endDate =
                index === 0
                  ? Date.now().toString()
                  : promotions[index - 1]?.promotion_date;
              const employmentDuration = getDuration(
                promotion.promotion_date,
                endDate
              );
              const formattedDuration = `${employmentDuration.years || 0}y - ${employmentDuration.months || 0}m - ${employmentDuration.days || 0}d`;

              return (
                <li className="flex space-x-4 group" key={index}>
                  <div className="size-[48px] relative after:absolute after:size-2 after:rounded-full after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-muted before:absolute before:w-0.5 before:h-[calc(100%_-_2px)] before:bg-muted before:top-[calc(100%_-_var(--space))] before:left-1/2 before:-translate-x-1/2 group-last:before:hidden before:rounded-full" />
                  <div className="space-y-1 items-center">
                    <p className="text-text-dark font-semibold text-sm capitalize">
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
