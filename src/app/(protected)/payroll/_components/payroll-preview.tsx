import { dateFormat } from "@/lib/date-converter";
import { employeeInfoById } from "@/lib/employee-info";
import { TPayroll } from "@/redux/features/payrollApiSlice/payrollType";
import { DialogContent, DialogTitle } from "@/ui/dialog";

const PayrollPreview = ({
  payrollData,
}: {
  payrollData: Partial<TPayroll>;
}) => {
  return (
    <DialogContent
      className="!max-w-4xl overflow-y-auto max-h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Payroll Details</DialogTitle>
      <div className="row justify-between items-center">
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">Employee</div>
          <div className="p-2 bg-light rounded">
            {employeeInfoById(payrollData.employee_id!).name}
          </div>
        </div>
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">Gross Salary</div>
          <div className="p-2 bg-light rounded">{payrollData.gross_salary}</div>
        </div>
        <div className="col-12">
          <div className="font-medium mb-3">Salary Logs</div>
          {payrollData.salary?.map((salary, index) => (
            <div className="border mb-4 p-3 rounded" key={index}>
              <div className="row">
                <div className="lg:col-6 mb-2">
                  <div className="font-medium mb-1">Amount</div>
                  <div className="p-2 bg-light rounded">{salary.amount}</div>
                </div>
                <div className="lg:col-6 mb-2">
                  <div className="font-medium mb-1">Date</div>
                  <div className="p-2 bg-light rounded">
                    {dateFormat(salary.date)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-12">
          <div className="font-medium mb-3">Bonus Logs</div>
          {payrollData.bonus?.map((bonus, index) => (
            <div className="border mb-4 p-3 rounded" key={index}>
              <div className="row">
                <div className="lg:col-6 mb-2">
                  <div className="font-medium mb-1">Type</div>
                  <div className="p-2 bg-light rounded">{bonus.type}</div>
                </div>
                <div className="lg:col-6 mb-2">
                  <div className="font-medium mb-1">Reason</div>
                  <div className="p-2 bg-light rounded">{bonus.reason}</div>
                </div>
                <div className="lg:col-6 mb-2">
                  <div className="font-medium mb-1">Amount</div>
                  <div className="p-2 bg-light rounded">{bonus.amount}</div>
                </div>
                <div className="lg:col-6 mb-2">
                  <div className="font-medium mb-1">Date</div>
                  <div className="p-2 bg-light rounded">
                    {dateFormat(bonus.date)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-12">
          <div className="font-medium mb-3">Increment Logs</div>
          {payrollData.increments?.map((increment, index) => (
            <div className="border mb-4 p-3 rounded" key={index}>
              <div className="row">
                <div className="lg:col-6 mb-2">
                  <div className="font-medium mb-1">Reason</div>
                  <div className="p-2 bg-light rounded">{increment.reason}</div>
                </div>
                <div className="lg:col-6 mb-2">
                  <div className="font-medium mb-1">Amount</div>
                  <div className="p-2 bg-light rounded">{increment.amount}</div>
                </div>
                <div className="lg:col-6 mb-2">
                  <div className="font-medium mb-1">Date</div>
                  <div className="p-2 bg-light rounded">
                    {dateFormat(increment.date)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  );
};

export default PayrollPreview;
