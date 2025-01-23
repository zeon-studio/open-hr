import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import EditFrom from "@/partials/EditFrom";
import { useGetEmployeeContactQuery } from "@/redux/features/employeeContactApiSlice/employeeContactSlice";
import { TEmployeeContact } from "@/redux/features/employeeContactApiSlice/employeeContactType";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function Emergency() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { data, isLoading } = useGetEmployeeContactQuery(employeeId);
  console.log(data);

  return (
    <div>
      <Card>
        <CardContent
          className={
            isLoading || !data?.result! ? "py-20" : "p-0 overflow-hidden"
          }
        >
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin size-5" />
            </div>
          ) : data?.result ? (
            <div className="flex flex-col gap-4">
              <EditFrom<TEmployeeContact>
                isUpdating={false}
                data={data?.result!}
                title="Family Details"
              >
                {({ handleChange, isReadOnly, data, formRef }) => {
                  return (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                      className="grid gap-3"
                      ref={formRef}
                    >
                      {data.contacts.length > 0 ? (
                        data?.contacts?.map((contact, index, contacts) => {
                          return (
                            <div
                              key={index}
                              className="grid lg:grid-cols-2 gap-3"
                            >
                              <div>
                                <Label>Name of Family Member</Label>
                                <Input
                                  onChange={(e) => {
                                    const { name, value } = e.target;
                                    handleChange({
                                      ...data,
                                      contacts: contacts.map((contact, i) => {
                                        if (index === i) {
                                          return { ...contact, [name]: value };
                                        }
                                        return contact;
                                      }),
                                    });
                                  }}
                                  value={contact.name}
                                  readOnly={isReadOnly}
                                  name="name"
                                  placeholder="Your answer"
                                />
                              </div>
                              <div>
                                <Label>Relation</Label>
                                <Input
                                  onChange={(e) => {
                                    const { name, value } = e.target;
                                    handleChange({
                                      ...data,
                                      contacts: contacts.map((contact, i) => {
                                        if (index === i) {
                                          return { ...contact, [name]: value };
                                        }
                                        return contact;
                                      }),
                                    });
                                  }}
                                  readOnly={isReadOnly}
                                  value={contact.relation}
                                  name="relation"
                                  placeholder="Your answer"
                                />
                              </div>
                              <div>
                                <Label>Bank Account Number</Label>
                                <Input
                                  onChange={(e) => {
                                    const { name, value } = e.target;
                                    handleChange({
                                      ...data,
                                      contacts: contacts.map((contact, i) => {
                                        if (index === i) {
                                          return { ...contact, [name]: value };
                                        }
                                        return contact;
                                      }),
                                    });
                                  }}
                                  readOnly={isReadOnly}
                                  name="bank_ac_no"
                                  value={contact.phone}
                                  placeholder="Your answer"
                                />
                              </div>

                              {contacts.length - 1 !== index && (
                                <Separator className="my-4 lg:col-span-2" />
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="py-4">
                          No contacts available. Please add a contact to view
                        </p>
                      )}
                      <Button
                        onClick={() => {
                          handleChange({
                            ...data,
                            contacts: [
                              ...data.contacts,
                              {
                                name: "",
                                phone: "",
                                relation: "",
                              },
                            ],
                          });
                        }}
                      >
                        Add More
                      </Button>
                    </form>
                  );
                }}
              </EditFrom>
            </div>
          ) : (
            <>
              <p className="text-center text-muted-foreground">
                No data available
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
