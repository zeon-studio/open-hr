import { useDialog } from "@/hooks/useDialog";
import { dateFormat, getDuration } from "@/lib/date-converter";
import { useGetEmployeeJobQuery } from "@/redux/features/employeeJobApiSlice/employeeJobSlice";
import { useAppSelector } from "@/redux/hook";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Dialog, DialogTrigger } from "@/ui/dialog";
import { Loader2, Pen } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import EmployeeJobForm from "./job-form";
import PreviousJobs from "./previous-jobs";

export default function JobDetails() {
  const { data: session } = useSession();
  const { company_name, company_website } = useAppSelector(
    (state) => state["setting-slice"]
  );
  const userRole = session?.user.role;

  const params = useParams<{ employeeId: string }>();
  let employeeId = params?.employeeId ?? "";
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
    data?.result?.resignation_date
      ? data?.result?.resignation_date
      : new Date().toISOString()
  );

  const formattedDuration = `${employmentDuration.years || 0}y - ${employmentDuration.months || 0}m - ${employmentDuration.days || 0}d`;

  interface Promotion {
    promotion_date: Date;
    designation: string;
  }

  const renderPromotion = (
    promotion: Promotion,
    index: number,
    promotions: Promotion[]
  ) => {
    const endDate =
      index === 0
        ? data?.result?.resignation_date
          ? data?.result?.resignation_date
          : new Date().toISOString()
        : promotions[index - 1]?.promotion_date;
    const employmentDuration = getDuration(promotion.promotion_date, endDate);
    const formattedDuration = `${employmentDuration.years || 0}y - ${employmentDuration.months || 0}m - ${employmentDuration.days || 0}d`;

    return (
      <li className="flex space-x-4 group" key={index}>
        <div className="size-[48px] -mt-3.5 relative after:absolute after:size-2 after:rounded-full after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-muted before:absolute before:w-0.5 before:h-[calc(100%_-_8px)] before:bg-muted before:top-[calc(100%_-_16px)] before:left-1/2 before:-translate-x-1/2 group-last:before:hidden before:rounded-full" />
        <div className="space-y-1 items-center">
          <p className="text-text-dark font-semibold text-sm capitalize">
            {promotion.designation}
          </p>
          <p className="text-text-light font-medium text-xs">
            {formattedDuration}
            <span className="ml-2">
              ({dateFormat(promotion.promotion_date)})
            </span>
          </p>
        </div>
      </li>
    );
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="border-b-transparent pb-0 flex-row gap-0 space-y-0">
          <CardTitle>Job Information</CardTitle>
          {(userRole === "admin" || userRole === "moderator") && (
            <Dialog
              modal={true}
              open={isDialogOpen}
              onOpenChange={onDialogChange}
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  size={"sm"}
                  className="space-x-1 ml-auto"
                  variant={"outline"}
                >
                  <Pen className="size-4" />
                  <span>Edit</span>
                </Button>
              </DialogTrigger>
              <EmployeeJobForm
                employeeJob={data?.result!}
                onDialogChange={onDialogChange}
              />
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex space-x-4">
              {company_website && (
                <Image
                  className="rounded"
                  src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${company_website}&size=64`}
                  width={48}
                  height={48}
                  alt={company_name ?? "brand logo"}
                />
              )}

              <div className="space-y-1 items-center">
                <p className="text-text-dark font-semibold text-sm capitalize">
                  {company_name}
                </p>
                <p className="text-text-light font-semibold text-xs">
                  {formattedDuration}
                </p>
              </div>
            </li>
            {data?.result.promotions?.map(renderPromotion)}
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
