import options from "@/config/options.json";
import { dateFormat, formatDateWithTime } from "@/lib/date-converter";
import { useUpdatePayrollMutation } from "@/redux/features/payrollApiSlice/payrollSlice";
import {
  TBonus,
  TIncrement,
  TPayroll,
  TSalary,
} from "@/redux/features/payrollApiSlice/payrollType";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { DialogContent, DialogTitle } from "@/ui/dialog";
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
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PayrollUpdate = ({
  payroll,
  onDialogChange,
}: {
  payroll: TPayroll;
  onDialogChange: (open: boolean) => void;
}) => {
  const [loader, setLoader] = useState(false);
  const [payrollData, setPayrollData] = useState({
    employee_id: payroll.employee_id,
    gross_salary: payroll.gross_salary || 0,
    salary: payroll.salary || [],
    bonus: payroll.bonus || [],
    increments: payroll.increments || [],
    status: payroll.status || "active",
  });

  const [salary, setSalary] = useState<TSalary[]>(payrollData.salary);
  const [bonus, setBonus] = useState<TBonus[]>(payrollData.bonus);
  const [increments, setIncrements] = useState<TIncrement[]>(
    payrollData.increments
  );

  const [updatePayroll, { isSuccess, isError }] = useUpdatePayrollMutation();

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      toast("Payroll Update complete");
      onDialogChange(false);
    } else if (isError) {
      setLoader(false);
      toast("Something went wrong");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  useEffect(() => {
    setPayrollData((prev) => ({
      ...prev,
      salary: salary.map((salaryItem) => ({
        amount: salaryItem.amount,
        date: salaryItem.date,
      })),
      bonus: bonus.map((bonusItem) => ({
        type: bonusItem.type,
        reason: bonusItem.reason,
        amount: bonusItem.amount,
        date: bonusItem.date,
      })),
      increments: increments.map((incrementItem) => ({
        reason: incrementItem.reason,
        amount: incrementItem.amount,
        date: incrementItem.date,
      })),
    }));
  }, [salary, bonus, increments]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    updatePayroll(payrollData);
  };

  const handleAddSalaryItem = () => {
    setSalary([
      ...salary,
      {
        amount: 0,
        date: new Date(),
      },
    ]);
  };

  const handleDeleteSalaryItem = async (index: number) => {
    setSalary((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleAddBonusItem = () => {
    setBonus([
      ...bonus,
      {
        type: "other",
        reason: "",
        amount: 0,
        date: new Date(),
      },
    ]);
  };

  const handleDeleteBonusItem = async (index: number) => {
    setBonus((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleAddIncrementItem = () => {
    setIncrements([
      ...increments,
      {
        reason: "",
        amount: 0,
        date: new Date(),
      },
    ]);
  };

  const handleDeleteIncrementItem = async (index: number) => {
    setIncrements((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <DialogContent
      className="!max-w-4xl overflow-y-auto max-h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Update Payroll</DialogTitle>
      <form
        className="row gx-3 justify-between items-center"
        onSubmit={handleSubmit}
      >
        {/* Gross Salary */}
        <div className="lg:col-6 mb-4">
          <Label>Gross Salary</Label>
          <Input
            type="number"
            value={payrollData.gross_salary}
            onChange={(e: any) =>
              setPayrollData({
                ...payrollData,
                gross_salary: Number(e.target.value),
              })
            }
            required
          />
        </div>
        {/* status */}
        <div className="lg:col-6 mb-4">
          <Label>Status</Label>
          <Select
            value={payrollData.status}
            onValueChange={(value) =>
              setPayrollData({
                ...payrollData,
                status: value as TPayroll["status"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {options.payroll_status.map((item) => (
                <SelectItem value={item.value} key={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Salary */}
        <div className="col-12 mb-6">
          {salary.map((item, index) => (
            <div
              className="border relative mb-6 bg-light rounded-md p-3"
              key={index}
            >
              <div className="absolute right-3 top-3">
                <Button
                  type="button"
                  onClick={() => handleDeleteSalaryItem(index)}
                  size={"xs"}
                  variant="outline"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="row gx-3">
                {/* Amount */}
                <div className="lg:col-6 mb-4">
                  <Label>Salary Amount</Label>
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) => {
                      const updatedSalaryItems = [...salary];
                      updatedSalaryItems[index] = {
                        ...item,
                        amount: Number(e.target.value),
                      };
                      setSalary(updatedSalaryItems);
                    }}
                    required
                  />
                </div>
                {/* Date */}
                <div className="lg:col-6 mb-4">
                  <Label>Salary Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"input"}
                        className="w-full flex justify-between"
                      >
                        {item.date ? (
                          dateFormat(item.date)
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={item.date ? new Date(item.date) : new Date()}
                        onSelect={(date) =>
                          setSalary((prevItems) => {
                            const updatedItems = [...prevItems];
                            if (date) {
                              updatedItems[index] = {
                                ...prevItems[index],
                                date: formatDateWithTime(date),
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
            onClick={handleAddSalaryItem}
            size={"sm"}
            className="w-full"
            variant="outline"
          >
            Add Salary
          </Button>
        </div>

        {/* Bonus */}
        <div className="col-12 mb-6">
          {bonus.map((item, index) => (
            <div
              className="border relative mb-6 bg-light rounded-md p-3"
              key={index}
            >
              <div className="absolute right-3 top-3">
                <Button
                  type="button"
                  onClick={() => handleDeleteBonusItem(index)}
                  size={"xs"}
                  variant="outline"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="row gx-3">
                {/* Type */}
                <div className="lg:col-6 mb-4">
                  <Label>Bonus Type</Label>
                  <Select
                    value={item.type}
                    onValueChange={(value) => {
                      const updatedBonusItems = [...bonus];
                      updatedBonusItems[index] = {
                        ...item,
                        type: value as
                          | "festive"
                          | "performance"
                          | "project"
                          | "other",
                      };
                      setBonus(updatedBonusItems);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.payroll_bonus_type.map((bonusType) => (
                        <SelectItem
                          value={bonusType.value}
                          key={bonusType.value}
                        >
                          {bonusType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Reason */}
                <div className="lg:col-6 mb-4">
                  <Label>Bonus Reason</Label>
                  <Input
                    type="text"
                    value={item.reason}
                    onChange={(e) => {
                      const updatedBonusItems = [...bonus];
                      updatedBonusItems[index] = {
                        ...item,
                        reason: e.target.value,
                      };
                      setBonus(updatedBonusItems);
                    }}
                    required
                  />
                </div>
                {/* Amount */}
                <div className="lg:col-6 mb-4">
                  <Label>Bonus Amount</Label>
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) => {
                      const updatedBonusItems = [...bonus];
                      updatedBonusItems[index] = {
                        ...item,
                        amount: Number(e.target.value),
                      };
                      setBonus(updatedBonusItems);
                    }}
                    required
                  />
                </div>
                {/* Date */}
                <div className="lg:col-6 mb-4">
                  <Label>Bonus Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"input"}
                        className="w-full flex justify-between"
                      >
                        {item.date ? (
                          dateFormat(item.date)
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={item.date ? new Date(item.date) : new Date()}
                        onSelect={(date) =>
                          setBonus((prevItems) => {
                            const updatedItems = [...prevItems];
                            updatedItems[index] = {
                              ...item,
                              date: formatDateWithTime(date!),
                            };
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
            onClick={handleAddBonusItem}
            size={"sm"}
            className="w-full"
            variant="outline"
          >
            Add Bonus
          </Button>
        </div>

        {/* Increments */}
        <div className="col-12 mb-6">
          {increments.map((item, index) => (
            <div
              className="border relative mb-6 bg-light rounded-md p-3"
              key={index}
            >
              <div className="absolute right-3 top-3">
                <Button
                  type="button"
                  onClick={() => handleDeleteIncrementItem(index)}
                  size={"xs"}
                  variant="outline"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="row gx-3">
                {/* reason */}
                <div className="col-12 mb-4">
                  <Label>Increment Reason</Label>
                  <Input
                    type="text"
                    value={item.reason}
                    onChange={(e) => {
                      const updatedPayrollItems = [...increments];
                      updatedPayrollItems[index] = {
                        ...item,
                        reason: e.target.value,
                      };
                      setIncrements(updatedPayrollItems);
                    }}
                    required
                  />
                </div>
                {/* Amount */}
                <div className="lg:col-6 mb-4">
                  <Label>Increment Amount</Label>
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) => {
                      const updatedPayrollItems = [...increments];
                      updatedPayrollItems[index] = {
                        ...item,
                        amount: Number(e.target.value),
                      };
                      setIncrements(updatedPayrollItems);
                    }}
                    required
                  />
                </div>
                {/* Date */}
                <div className="lg:col-6 mb-4">
                  <Label>Increment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"input"}
                        className="w-full flex justify-between"
                      >
                        {item.date ? (
                          dateFormat(item.date)
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={item.date ? new Date(item.date) : new Date()}
                        onSelect={(date) => {
                          setIncrements((prevItems) => {
                            const updatedItems = [...prevItems];
                            updatedItems[index] = {
                              ...item,
                              date: formatDateWithTime(date!),
                            };
                            return updatedItems;
                          });
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            onClick={handleAddIncrementItem}
            size={"sm"}
            className="w-full"
            variant="outline"
          >
            Add Increment
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
              "Update Payroll"
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default PayrollUpdate;
