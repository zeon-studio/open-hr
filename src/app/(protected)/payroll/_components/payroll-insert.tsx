import options from "@/config/options.json";
import { dateFormat, formatDateWithTime } from "@/lib/date-converter";
import { useGetEmployeesBasicsQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import {
  useAddMonthlyPayrollMutation,
  useGetPayrollBasicsQuery,
} from "@/redux/features/payrollApiSlice/payrollSlice";
import { TCreateMonthlySalary } from "@/redux/features/payrollApiSlice/payrollType";
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
import { CalendarIcon, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PayrollInsert = ({
  onDialogChange,
}: {
  onDialogChange: (open: boolean) => void;
}) => {
  // get all employees payroll from cache or api
  const { data } = useGetPayrollBasicsQuery(undefined);
  const { result: employeesPayroll } = data || {};

  const { data: employeesData } = useGetEmployeesBasicsQuery(undefined);
  const { result: employees } = employeesData || {};

  const initialPayrollData: TCreateMonthlySalary = {
    salary_date: new Date(),
    employees: [],
  };

  const [loader, setLoader] = useState(false);
  const [payrollData, setPayrollData] =
    useState<TCreateMonthlySalary>(initialPayrollData);

  const [addPayroll, { isSuccess, isError, error }] =
    useAddMonthlyPayrollMutation();

  const [showBonusFields, setShowBonusFields] = useState<boolean[]>([]);

  useEffect(() => {
    if (employeesPayroll) {
      setPayrollData({
        salary_date: new Date(),
        employees: employeesPayroll.map((emp: any) => ({
          employee_id: emp.employee_id,
          gross_salary: emp.gross_salary,
          bonus_type: "festive",
          bonus_amount: 0,
          bonus_reason: "",
        })),
      });
      setShowBonusFields(employeesPayroll.map(() => false));
    }
  }, [employeesPayroll]);

  const handleAddEmployee = () => {
    setPayrollData((prev) => ({
      ...prev,
      employees: [
        ...prev.employees,
        {
          employee_id: `${Date.now()}-${Math.random()}`,
          gross_salary: 0,
          bonus_type: "",
          bonus_reason: "",
          bonus_amount: 0,
        },
      ],
    }));
    setShowBonusFields((prev) => [...prev, false]);
  };

  const handleRemoveEmployee = (employee_id: string) => {
    setPayrollData((prev) => ({
      ...prev,
      employees: prev.employees.filter(
        (employee) => employee.employee_id !== employee_id
      ),
    }));
    setShowBonusFields((prev) =>
      prev.filter(
        (_, i) => payrollData.employees[i].employee_id !== employee_id
      )
    );
  };

  const handleShowBonusFields = (index: number) => {
    setShowBonusFields((prev) =>
      prev.map((show, i) => (i === index ? true : show))
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      // @ts-ignore
      addPayroll(payrollData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      setPayrollData(payrollData);
      // close modal/dialog
      onDialogChange(false);
      toast("Payroll added successfully");
    } else if (isError) {
      setLoader(false);
      toast("Something went wrong");
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <DialogContent
      className="!max-w-2xl overflow-y-auto max-h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Add New Payroll</DialogTitle>
      <form onSubmit={handleSubmit} className="row gx-3">
        <div className="col-12 mb-4">
          <Label>Salary Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"input"} className="w-full flex justify-between">
                {payrollData.salary_date ? (
                  dateFormat(payrollData.salary_date)
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
                required
                mode="single"
                selected={
                  payrollData.salary_date
                    ? new Date(payrollData.salary_date)
                    : new Date()
                }
                onSelect={(date) => {
                  setPayrollData((prev) => ({
                    ...prev,
                    salary_date: formatDateWithTime(date!),
                  }));
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="col-12 mb-6">
          {payrollData.employees.map((item, index) => (
            <div
              className="border border-border relative mb-6 bg-light rounded-md p-3"
              key={item.employee_id}
            >
              <div className="absolute right-3 top-3">
                <Button
                  type="button"
                  onClick={() => handleRemoveEmployee(item.employee_id)}
                  size={"xs"}
                  variant="outline"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="row">
                {/* Employee */}
                <div className="lg:col-6 mb-4">
                  <Label>Name:</Label>
                  <Select
                    value={item.employee_id}
                    onValueChange={(value) => {
                      const selectedEmployee = employees?.find(
                        (employee) => employee.id === value
                      );
                      if (selectedEmployee) {
                        setPayrollData((prev) => ({
                          ...prev,
                          employees: prev.employees.map((employee, i) => {
                            if (i === index) {
                              return {
                                ...employee,
                                employee_id: selectedEmployee.id,
                              };
                            }
                            return employee;
                          }),
                        }));
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees
                        ?.filter(
                          (employee) =>
                            !payrollData.employees.some(
                              (payrollEmployee) =>
                                payrollEmployee.employee_id === employee.id
                            ) || employee.id === item.employee_id
                        )
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Gross Salary */}
                <div className="lg:col-6 mb-4">
                  <Label>Gross Salary</Label>
                  <Input
                    type="number"
                    value={item.gross_salary}
                    onChange={(e) => {
                      const updatedEmployees = [...payrollData.employees];
                      updatedEmployees[index] = {
                        ...item,
                        gross_salary: Number(e.target.value),
                      };
                      setPayrollData((prev) => ({
                        ...prev,
                        employees: updatedEmployees,
                      }));
                    }}
                    required
                  />
                </div>
                {/* Add Bonus Button */}
                {!showBonusFields[index] && (
                  <div className="col-12 mb-4">
                    <Button
                      type="button"
                      onClick={() => handleShowBonusFields(index)}
                      size={"sm"}
                      className="w-full"
                      variant="outline"
                    >
                      Add Bonus
                    </Button>
                  </div>
                )}
                {/* Bonus Fields */}
                {showBonusFields[index] && (
                  <>
                    {/* Bonus Type */}
                    <div className="lg:col-6 mb-4">
                      <Label>Bonus Type</Label>
                      <Select
                        required
                        value={item.bonus_type}
                        onValueChange={(value) => {
                          const updatedEmployees = [...payrollData.employees];
                          updatedEmployees[index] = {
                            ...item,
                            bonus_type: value,
                          };
                          setPayrollData((prev) => ({
                            ...prev,
                            employees: updatedEmployees,
                          }));
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Bonus Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {options.payroll_bonus_type.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Bonus Amount */}
                    <div className="lg:col-6 mb-4">
                      <Label>Bonus Amount</Label>
                      <Input
                        required
                        type="number"
                        value={item.bonus_amount}
                        onChange={(e) => {
                          const updatedEmployees = [...payrollData.employees];
                          updatedEmployees[index] = {
                            ...item,
                            bonus_amount: Number(e.target.value),
                          };
                          setPayrollData((prev) => ({
                            ...prev,
                            employees: updatedEmployees,
                          }));
                        }}
                      />
                    </div>
                    {/* Bonus Reason */}
                    <div className="col-12 mb-4">
                      <Label>Bonus Reason</Label>
                      <Input
                        type="text"
                        value={item.bonus_reason}
                        onChange={(e) => {
                          const updatedEmployees = [...payrollData.employees];
                          updatedEmployees[index] = {
                            ...item,
                            bonus_reason: e.target.value,
                          };
                          setPayrollData((prev) => ({
                            ...prev,
                            employees: updatedEmployees,
                          }));
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          <Button
            type="button"
            onClick={handleAddEmployee}
            size={"sm"}
            className="w-full"
            variant="outline"
          >
            Add Employee
          </Button>
        </div>

        <div className="col-12 text-right">
          <Button className="self-end" disabled={loader}>
            {loader ? (
              <>
                Please wait
                <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
              </>
            ) : (
              "Add Now"
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default PayrollInsert;
