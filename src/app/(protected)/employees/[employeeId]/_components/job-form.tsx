import { dateFormat, formatDateWithTime } from "@/lib/date-converter";
import { employeeGroupByDepartment } from "@/lib/employee-info";
import { useUpdateEmployeeJobMutation } from "@/redux/features/employeeJobApiSlice/employeeJobSlice";
import {
  TEmployeeJob,
  TPromotion,
} from "@/redux/features/employeeJobApiSlice/employeeJobType";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { DialogContent, DialogTitle } from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { CalendarIcon, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EmployeeJobForm = ({
  employeeJob,
  onDialogChange,
}: {
  employeeJob: Partial<TEmployeeJob>;
  onDialogChange: (open: boolean) => void;
}) => {
  const [loader, setLoader] = useState(false);
  const [employeeJobData, setEmployeeJobData] = useState<Partial<TEmployeeJob>>(
    {
      employee_id: employeeJob.employee_id,
      manager_id: employeeJob.manager_id,
      joining_date: employeeJob.joining_date,
      permanent_date: employeeJob.permanent_date,
      promotions: employeeJob.promotions,
      note: employeeJob.note,
    }
  );

  const [updateEmployeeJob, { isSuccess, isError, error }] =
    useUpdateEmployeeJobMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    updateEmployeeJob(employeeJobData);
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      toast("EmployeeJob Update complete");
      // close modal
      onDialogChange(false);
    } else if (isError) {
      setLoader(false);
      toast("Something went wrong");
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  const [employeeJobPromotions, setEmployeeJobLogs] = useState<TPromotion[]>(
    employeeJobData.promotions || []
  );

  // set employeeJob promotions
  useEffect(() => {
    setEmployeeJobData((prev) => ({
      ...prev,
      promotions: employeeJobPromotions.map((employeeJobItem) => ({
        designation: employeeJobItem.designation,
        promotion_date: employeeJobItem.promotion_date,
      })),
    }));
  }, [employeeJobPromotions]);

  // add new promotion
  const handleAddEmployeeJobPromotion = () => {
    setEmployeeJobLogs([
      ...employeeJobPromotions,
      {
        designation: "",
        promotion_date: new Date(),
      },
    ]);
  };

  // delete promotion
  const handleDeleteEmployeeJobPromotion = async (index: number) => {
    setEmployeeJobLogs((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <DialogContent
      className="!max-w-4xl overflow-y-auto max-h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Update Employee Job Details</DialogTitle>
      <form
        className="row justify-between items-center"
        onSubmit={handleSubmit}
      >
        {/* joining date */}
        <div className="lg:col-6 mb-4">
          <Label>Joining Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"input"} className="w-full flex justify-between">
                {employeeJobData.joining_date ? (
                  dateFormat(employeeJobData.joining_date)
                ) : (
                  <span>Pick a date</span>
                )}
                <span className="flex items-center">
                  <span className="bg-border mb-2 mt-2 h-5 block w-[1px]"></span>
                  <span className="pl-2  block">
                    <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                  </span>
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  employeeJobData.joining_date
                    ? new Date(employeeJobData.joining_date)
                    : new Date()
                }
                onSelect={(date) =>
                  setEmployeeJobData({
                    ...employeeJobData,
                    joining_date: date ? formatDateWithTime(date) : undefined,
                  })
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* permanent date */}
        <div className="lg:col-6 mb-4">
          <Label>Permanent Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"input"} className="w-full flex justify-between">
                {employeeJobData.permanent_date ? (
                  dateFormat(employeeJobData.permanent_date)
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
                  employeeJobData.permanent_date
                    ? new Date(employeeJobData.permanent_date)
                    : new Date()
                }
                onSelect={(date) =>
                  setEmployeeJobData({
                    ...employeeJobData,
                    permanent_date: date ? formatDateWithTime(date) : undefined,
                  })
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Manager ID */}
        <div className="lg:col-12 mb-4">
          <Label>Reports To</Label>
          <Select
            value={employeeJobData.manager_id || "none"}
            onValueChange={(value) =>
              setEmployeeJobData({
                ...employeeJobData,
                manager_id: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select User" />
            </SelectTrigger>
            <SelectContent>
              {employeeGroupByDepartment().map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.options.map(
                    (option: { value: string; label: string }) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* note */}
        <div className="col-12 mb-4">
          <Label>Note</Label>
          <Textarea
            value={employeeJobData.note}
            onChange={(e: any) =>
              setEmployeeJobData({ ...employeeJobData, note: e.target.value })
            }
          />
        </div>

        {/* promotions */}
        <div className="col-12 mb-6">
          <Label>Job Promotions</Label>
          {employeeJobPromotions.map((item, index) => (
            <div
              className="border border-border relative mb-6 bg-light rounded-md p-3"
              key={index}
            >
              <div className="absolute right-3 top-3">
                <Button
                  type="button"
                  onClick={() => handleDeleteEmployeeJobPromotion(index)}
                  size={"xs"}
                  variant="outline"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="row">
                {/* Designation */}
                <div className="lg:col-6 mb-4">
                  <Label>Designation</Label>
                  <Input
                    type="text"
                    value={item.designation}
                    onChange={(e) => {
                      const updatedEmployeeJobItems = [
                        ...employeeJobPromotions,
                      ];
                      updatedEmployeeJobItems[index] = {
                        ...item,
                        designation: e.target.value,
                      };
                      setEmployeeJobLogs(updatedEmployeeJobItems);
                    }}
                    required
                  />
                </div>
                {/* Promotion Date */}
                <div className="lg:col-6 mb-4">
                  <Label>Promotion Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"input"}
                        className="w-full flex justify-between"
                      >
                        {item.promotion_date ? (
                          dateFormat(item.promotion_date)
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          item.promotion_date
                            ? new Date(item.promotion_date)
                            : new Date()
                        }
                        onSelect={(date) =>
                          setEmployeeJobLogs((prevItems) => {
                            const updatedItems = [...prevItems];
                            if (date) {
                              updatedItems[index] = {
                                ...prevItems[index],
                                promotion_date: formatDateWithTime(date),
                              };
                            }
                            return updatedItems;
                          })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            onClick={handleAddEmployeeJobPromotion}
            size={"sm"}
            className="w-full"
            variant="outline"
          >
            Add Promotion
          </Button>
        </div>

        <div className="col-12 text-right">
          <Button type="submit" disabled={loader}>
            {loader ? (
              <>
                Please wait
                <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
              </>
            ) : (
              "Update Job Details"
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default EmployeeJobForm;
