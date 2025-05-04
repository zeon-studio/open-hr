import { useDialog } from "@/hooks/useDialog";
import {
  dateFormat,
  formatDateWithTime,
  getDuration,
} from "@/lib/date-converter";
import { useUpdateEmployeeJobMutation } from "@/redux/features/employeeJobApiSlice/employeeJobSlice";
import {
  TEmployeeJob,
  TPrevJob,
} from "@/redux/features/employeeJobApiSlice/employeeJobType";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { CalendarIcon, Loader2, Pen, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const initialPrevJobData: TPrevJob = {
  company_name: "",
  company_website: "",
  designation: "",
  end_date: "" as any,
  job_type: "" as any,
  start_date: "" as any,
};

export default function PreviousJobs({
  prev_jobs,
  employee,
}: {
  prev_jobs: TPrevJob[];
  employee: TEmployeeJob;
}) {
  const { data: session } = useSession();
  const userRole = session?.user.role;
  const { isDialogOpen, onDialogChange } = useDialog();
  const [updatePrev, { isLoading: isPrevJobLoading }] =
    useUpdateEmployeeJobMutation();
  const [prevJobData, setPrevJobData] = useState<TPrevJob[]>(
    prev_jobs?.length ? prev_jobs : [initialPrevJobData]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePrev({
        ...employee,
        prev_jobs: prevJobData,
      }).unwrap();
      toast.success("Update job successfully!");
      onDialogChange(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (job: TPrevJob, index: number) => {
    setPrevJobData(
      prevJobData.map((prevJob, i) => {
        if (index === i) {
          return {
            ...job,
          };
        } else {
          return prevJob;
        }
      })
    );
  };

  const handleDelete = (index: number) => {
    setPrevJobData(prevJobData.filter((prev, i) => i !== index));
  };

  const handleAdd = () => {
    setPrevJobData([
      // @ts-ignore
      ...prevJobData,
      {
        company_name: "",
        company_website: "",
        designation: "",
        // @ts-ignore
        job_type: "",
        // @ts-ignore
        end_date: "",
        // @ts-ignore
        start_date: "",
      },
    ]);
  };

  return (
    <Card>
      <CardHeader className="border-b-transparent pb-0 flex-row gap-0 space-y-0">
        <CardTitle>Previous Jobs</CardTitle>
        {(userRole === "admin" || userRole === "moderator") && (
          <Dialog open={isDialogOpen} onOpenChange={onDialogChange}>
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
            <DialogContent
              onEscapeKeyDown={(e) => {
                if (isPrevJobLoading) e.preventDefault();
              }}
              onPointerDownOutside={(e) => {
                if (isPrevJobLoading) e.preventDefault();
              }}
              className="!max-w-2xl w-full overflow-y-auto max-h-[90vh]"
            >
              <DialogHeader className="mb-8">
                <DialogTitle>Update Previous Job</DialogTitle>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {prevJobData.map((job, index) => {
                  return (
                    <div
                      className="grid grid-cols-1 gap-4 border border-border mb-6 relative bg-light rounded-md p-3"
                      key={index}
                    >
                      <div className="absolute right-3 top-3">
                        <Button
                          type="button"
                          size={"xs"}
                          variant="outline"
                          onClick={() => {
                            handleDelete(index);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div>
                        <Label>Company Name</Label>
                        <Input
                          type="text"
                          value={job.company_name}
                          onChange={(e) => {
                            handleChange(
                              {
                                ...job,
                                company_name: e.target.value,
                              },
                              index
                            );
                          }}
                          required
                        />
                      </div>

                      <div>
                        <Label>Company Website</Label>
                        <Input
                          type="url"
                          value={job.company_website}
                          onChange={(e) =>
                            handleChange(
                              {
                                ...job,
                                company_website: e.target.value,
                              },
                              index
                            )
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label>Designation</Label>
                        <Input
                          type="text"
                          value={job.designation}
                          onChange={(e) =>
                            handleChange(
                              {
                                ...job,
                                designation: e.target.value,
                              },
                              index
                            )
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label>Job Type</Label>
                        <Select
                          value={job.job_type}
                          onValueChange={(value) => {
                            handleChange(
                              {
                                ...job,
                                job_type: value as any,
                              },
                              index
                            );
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full_time">Full Time</SelectItem>
                            <SelectItem value="part_time">Part Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">
                              Internship
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="input"
                              className="w-full flex justify-between"
                            >
                              {job.start_date ? (
                                dateFormat(job.start_date)
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <span className="flex items-center">
                                <span className="bg-border mb-2 mt-2 h-5 block w-[1px]"></span>
                                <span className="pl-2 block">
                                  <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                                </span>
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                job.start_date
                                  ? new Date(job.start_date)
                                  : new Date()
                              }
                              onSelect={(date) =>
                                handleChange(
                                  {
                                    ...job,
                                    start_date: formatDateWithTime(date!),
                                  },
                                  index
                                )
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="input"
                              className="w-full flex justify-between"
                            >
                              {job.end_date ? (
                                dateFormat(job.end_date)
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <span className="flex items-center">
                                <span className="bg-border mb-2 mt-2 h-5 block w-[1px]"></span>
                                <span className="pl-2 block">
                                  <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                                </span>
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                job.end_date
                                  ? new Date(job.end_date)
                                  : new Date()
                              }
                              onSelect={(date) => {
                                handleChange(
                                  {
                                    ...job,
                                    end_date: formatDateWithTime(date!),
                                  },
                                  index
                                );
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  );
                })}

                <Button
                  type="button"
                  size={"sm"}
                  className="w-full"
                  variant="outline"
                  onClick={handleAdd}
                >
                  Add Job
                </Button>

                <div className="col-12 text-right">
                  <Button disabled={isPrevJobLoading}>
                    {isPrevJobLoading ? (
                      <>
                        Please wait
                        <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
                      </>
                    ) : (
                      "Update Job"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      {/* Rest of the component stays the same */}
      <CardContent>
        <ul className="space-y-4">
          {prev_jobs.length === 0 ? (
            <li>
              <p className="text-text-light font-semibold text-sm">
                No previous jobs
              </p>
            </li>
          ) : (
            prev_jobs.map((job, index) => {
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
                    <p className="text-text-dark font-semibold text-sm capitalize">
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
            })
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
