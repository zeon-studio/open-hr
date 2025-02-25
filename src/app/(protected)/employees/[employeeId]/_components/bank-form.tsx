import EditForm from "@/partials/edit-from";
import { TEmployeeBank } from "@/redux/features/employeeBankApiSlice/employeeBankType";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Separator } from "@/ui/separator";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";

interface BankFormProps {
  data: TEmployeeBank;
  isUpdating: boolean;
  onSubmit: (data: TEmployeeBank) => void;
}

export default function BankForm({
  data,
  isUpdating,
  onSubmit,
}: BankFormProps) {
  return (
    <EditForm<TEmployeeBank>
      isUpdating={isUpdating}
      data={data}
      title="Bank Details"
    >
      {(props) => <BankFormFields {...props} onSubmit={onSubmit} />}
    </EditForm>
  );
}

function BankFormFields({
  handleChange,
  isReadOnly,
  data,
  formRef,
  onSubmit,
}: {
  handleChange: (value: TEmployeeBank) => void;
  isReadOnly: boolean;
  data: TEmployeeBank;
  formRef: React.RefObject<HTMLFormElement | null>;
  onSubmit: (data: TEmployeeBank) => void;
}) {
  useEffect(() => {
    if (!isReadOnly && (!data?.banks || data.banks.length === 0)) {
      handleChange({
        ...data,
        banks: [
          {
            bank_ac_no: "",
            bank_branch: "",
            bank_ac_name: "",
            bank_district: "",
            bank_name: "",
            bank_routing_no: "",
          },
        ],
      });
    }
  }, [isReadOnly, data, handleChange]);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(data);
      }}
      className="space-y-4"
    >
      {data?.banks.length > 0 ? (
        data?.banks?.map((bank, index, banks) => {
          return (
            <div
              key={index}
              className={`${isReadOnly ? "bg-white" : "bg-light px-5 pt-5"} rounded relative`}
            >
              {!isReadOnly && (
                <div className="lg:col-span-2 absolute right-5 top-3">
                  <Button
                    type="button"
                    size={"xs"}
                    variant="outline"
                    onClick={() => {
                      handleChange({
                        ...data,
                        banks: data.banks.filter((bank, i) => i !== index),
                      });
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              )}
              <div className="row gx-3">
                <div className="lg:col-6 mb-4">
                  <Label>Account Name:</Label>
                  <Input
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange({
                        ...data,
                        banks: banks.map((bank, i) => {
                          if (index === i) {
                            return { ...bank, [name]: value };
                          }
                          return bank;
                        }),
                      });
                    }}
                    value={bank.bank_ac_name || ""}
                    readOnly={isReadOnly}
                    name="bank_ac_name"
                    placeholder="Bank Account Name"
                  />
                </div>
                <div className="lg:col-6 mb-4">
                  <Label>Bank Name:</Label>
                  <Input
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange({
                        ...data,
                        banks: banks.map((bank, i) => {
                          if (index === i) {
                            return { ...bank, [name]: value };
                          }
                          return bank;
                        }),
                      });
                    }}
                    required
                    readOnly={isReadOnly}
                    value={bank.bank_name || ""}
                    name="bank_name"
                    placeholder="Bank Name"
                  />
                </div>
                <div className="lg:col-6 mb-4">
                  <Label>Bank Account Number:</Label>
                  <Input
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange({
                        ...data,
                        banks: banks.map((bank, i) => {
                          if (index === i) {
                            return { ...bank, [name]: value };
                          }
                          return bank;
                        }),
                      });
                    }}
                    required
                    readOnly={isReadOnly}
                    name="bank_ac_no"
                    value={bank.bank_ac_no || ""}
                    placeholder="Bank Account Number"
                  />
                </div>
                <div className="lg:col-6 mb-4">
                  <Label>Branch:</Label>
                  <Input
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange({
                        ...data,
                        banks: banks.map((bank, i) => {
                          if (index === i) {
                            return { ...bank, [name]: value };
                          }
                          return bank;
                        }),
                      });
                    }}
                    required
                    placeholder="Branch"
                    readOnly={isReadOnly}
                    value={bank.bank_branch || ""}
                    name="bank_branch"
                  />
                </div>
              </div>
              {isReadOnly && banks?.length - 1 !== index && (
                <Separator className="my-6 lg:col-span-2" />
              )}
            </div>
          );
        })
      ) : (
        <p className="py-4">No bank account information available.</p>
      )}
      {!isReadOnly && (
        <Button
          variant="outline"
          className="w-full mt-6"
          type="button"
          onClick={() => {
            handleChange({
              ...data,
              banks: [
                ...(data?.banks || []),
                {
                  bank_ac_no: "",
                  bank_branch: "",
                  bank_ac_name: "",
                  bank_district: "",
                  bank_name: "",
                  bank_routing_no: "",
                },
              ],
            });
          }}
          disabled={isReadOnly}
        >
          Add Bank Account
        </Button>
      )}
    </form>
  );
}
