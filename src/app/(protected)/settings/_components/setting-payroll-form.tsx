import EditFrom from "@/partials/edit-from";
import { TSetting } from "@/redux/features/settingApiSlice/settingType";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

interface SettingPayrollFormProps {
  isUpdating: boolean;
  data: TSetting;
  handleSubmit: (data: TSetting) => void;
}

export default function SettingPayrollForm({
  isUpdating,
  data,
  handleSubmit,
}: SettingPayrollFormProps) {
  return (
    <EditFrom<TSetting> isUpdating={isUpdating} data={data} title="Payroll">
      {({ handleChange, isReadOnly, data, formRef }) => {
        return (
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(data);
            }}
            className="row gap-y-4"
          >
            <div className="lg:col-6">
              <Label>Basic (% of Gross):</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({
                    ...data,
                    payroll: {
                      ...data.payroll,
                      [name.split(".")[1]]: value,
                    },
                  });
                }}
                type="text"
                value={data.payroll.basic || ""}
                name="payroll.basic"
                placeholder="Basic"
                readOnly={isReadOnly}
              />
            </div>
            <div className="lg:col-6">
              <Label>House Rent Allowance (% of Basic):</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({
                    ...data,
                    payroll: {
                      ...data.payroll,
                      [name.split(".")[1]]: value,
                    },
                  });
                }}
                type="text"
                value={data.payroll.house_rent || ""}
                name="payroll.house_rent"
                placeholder="House Rent Allowance"
                readOnly={isReadOnly}
              />
            </div>
            <div className="lg:col-6">
              <Label>Medical Allowance (% of Basic):</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({
                    ...data,
                    payroll: {
                      ...data.payroll,
                      [name.split(".")[1]]: value,
                    },
                  });
                }}
                type="text"
                value={data.payroll.medical || ""}
                name="payroll.medical"
                placeholder="Medical Allowance"
                readOnly={isReadOnly}
              />
            </div>
            <div className="lg:col-6">
              <Label>Conveyance Allowance (% of Basic):</Label>
              <Input
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleChange({
                    ...data,
                    payroll: {
                      ...data.payroll,
                      [name.split(".")[1]]: value,
                    },
                  });
                }}
                type="text"
                value={data.payroll.conveyance || ""}
                name="payroll.conveyance"
                placeholder="Conveyance Allowance"
                readOnly={isReadOnly}
              />
            </div>
          </form>
        );
      }}
    </EditFrom>
  );
}
