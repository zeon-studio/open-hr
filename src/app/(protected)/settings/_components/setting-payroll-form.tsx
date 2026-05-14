import { TSetting } from "@/features/settings/types";
import EditFrom from "@/layouts/edit-from";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface SettingPayrollFormProps {
  data: TSetting;
}

export default function SettingPayrollForm({ data }: SettingPayrollFormProps) {
  const [isActionUpdating, setIsActionUpdating] = useState(false);

  return (
    <EditFrom<TSetting>
      isUpdating={isActionUpdating}
      data={data}
      title="Payroll"
    >
      {({ handleChange, isReadOnly, data, formRef }) => {
        return (
          <form
            ref={formRef}
            onSubmit={async (e) => {
              e.preventDefault();
              setIsActionUpdating(true);
              try {
                const res = await fetch("/api/setting", {
                  method: "PATCH",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ payroll: data.payroll }),
                });

                if (!res.ok) {
                  throw new Error("Failed to update settings");
                }

                toast("Setting update complete");
              } catch {
                toast("Something went wrong");
              } finally {
                setIsActionUpdating(false);
              }
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
