import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDialog } from "@/hooks/useDialog";
import { getDuration } from "@/lib/dateFormat";
import { cn } from "@/lib/shadcn";
import { usePromoteEmployeeMutation } from "@/redux/features/employeeJobApiSlice/employeeJobSlice";
import {
  TEmployeeJob,
  TPromotion,
} from "@/redux/features/employeeJobApiSlice/employeeJobType";
import { ErrorResponse } from "@/types";
import { CalendarIcon, Loader2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function JobInformation({
  company_website,
  promotions,
  company_name,
  joining_date,
  formattedDuration,
  employee,
}: {
  company_website: string;
  employeeId: string;
  promotions: TPromotion[];
  company_name: string;
  joining_date: Date;
  formattedDuration: string;
  employee: TEmployeeJob;
}) {
  const { data: session } = useSession();
  const userRole = session?.user.role;
  const { isDialogOpen, onDialogChange } = useDialog();
  const [promotionData, setPromotionData] = useState<TPromotion[]>(promotions);

  const [promoteEmployee, { isLoading: isPromoteEmployeeLoading }] =
    usePromoteEmployeeMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await promoteEmployee({
        ...employee,
        promotions: promotionData,
      }).unwrap();
      onDialogChange(false);
      toast.success("Employee promote successfully!");
    } catch (error) {
      toast.error(
        (error as ErrorResponse).data.message || "Something with wrong!"
      );
    }
  };

  const handleChange = (promotion: TPromotion, index: number) => {
    setPromotionData(
      promotionData.map((prevJob, i) => {
        if (index === i) {
          return {
            ...promotion,
          };
        } else {
          return prevJob;
        }
      })
    );
  };

  const handleDelete = (index: number) => {
    setPromotionData(promotions.filter((prev, i) => i !== index));
  };

  const handleAdd = () => {
    setPromotionData([
      // @ts-ignore
      ...promotionData,
      {
        designation: "",
        // @ts-ignore
        promotion_date: "",
      },
    ]);
  };

  return (
    <Card>
      <CardHeader className="border-b-transparent pb-0 flex-row gap-0 space-y-0">
        <CardTitle>Job Information</CardTitle>
        {userRole !== "user" && (
          <Dialog open={isDialogOpen} onOpenChange={onDialogChange}>
            <DialogTrigger asChild>
              <Button className="ml-auto">Update Job Info</Button>
            </DialogTrigger>
            <DialogContent
              onEscapeKeyDown={(e) => {
                if (isPromoteEmployeeLoading) {
                  e.preventDefault();
                }
              }}
              onPointerDownOutside={(e) => {
                if (isPromoteEmployeeLoading) {
                  e.preventDefault();
                }
              }}
            >
              <DialogHeader className="sr-only">
                <DialogTitle>Update your job information</DialogTitle>
              </DialogHeader>
              <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                {promotionData.map((promotion, index) => {
                  return (
                    <div
                      className="grid grid-cols-1 gap-4 border mb-6 relative bg-light rounded-md p-3"
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
                        <Label>Designation</Label>
                        <Input
                          type="text"
                          value={promotion.designation}
                          onChange={(e) => {
                            handleChange(
                              {
                                ...promotion,
                                designation: e.target.value,
                              },
                              index
                            );
                          }}
                          required
                        />
                      </div>

                      <div>
                        <Label>Promotion Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"input"}
                              className={cn("w-full flex justify-between")}
                            >
                              {promotion.promotion_date ? (
                                new Date(
                                  promotion.promotion_date
                                ).toDateString()
                              ) : (
                                <span>Select Date</span>
                              )}
                              <span className="flex items-center">
                                <span
                                  className={cn(
                                    "bg-[#cccccc] mb-2 mt-2 h-5 block w-[1px]"
                                  )}
                                ></span>
                                <span className={cn("pl-2  block")}>
                                  <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                                </span>
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={new Date()}
                              onSelect={(date) => {
                                handleChange(
                                  {
                                    ...promotion,
                                    promotion_date: date!,
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
                  Add
                </Button>

                <div className="text-right">
                  <Button disabled={isPromoteEmployeeLoading}>
                    {isPromoteEmployeeLoading ? (
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
          {promotions?.map((promotion, index, promotions) => {
            const startDate =
              index === promotions.length - 1
                ? joining_date // If it's the last promotion, use joining date
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
  );
}
