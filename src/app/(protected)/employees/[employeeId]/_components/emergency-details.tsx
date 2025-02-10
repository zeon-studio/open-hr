import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import EditFrom from "@/partials/edit-from";
import {
  useGetEmployeeContactQuery,
  useUpdateEmployeeContactMutation,
} from "@/redux/features/employeeContactApiSlice/employeeContactSlice";
import { TEmployeeContact } from "@/redux/features/employeeContactApiSlice/employeeContactType";
import { Loader2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Emergency() {
  const { data: session } = useSession();
  let { employeeId } = useParams<{ employeeId: string }>();
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }
  const [
    addContact,
    { isLoading: isAddLoading, isSuccess: isAddSuccess, isError: isAddError },
  ] = useUpdateEmployeeContactMutation();
  const { data, isLoading } = useGetEmployeeContactQuery(employeeId);

  useEffect(() => {
    if (isAddSuccess) {
      toast("Emergency contact details updated successfully");
    } else if (isAddError) {
      toast("Failed to update emergency contact details");
    }
  }, [isAddSuccess, isAddError]);

  return (
    <div>
      {isLoading ? (
        <Card>
          <CardContent className={"py-20"}>
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin size-5" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <EditFrom<TEmployeeContact>
            isUpdating={isAddLoading}
            data={data?.result!}
            title="Emergency Contact Details"
          >
            {({ handleChange, isReadOnly, data, formRef }) => {
              return (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addContact({
                      contacts: data.contacts,
                      employee_id: employeeId,
                    });
                  }}
                  className={"space-y-4"}
                  ref={formRef}
                >
                  {data?.contacts.length > 0 ? (
                    data?.contacts?.map((contact, index, contacts) => {
                      return (
                        <div
                          className={`${isReadOnly ? "bg-white" : "bg-light px-5 pt-5"} rounded relative`}
                          key={index}
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
                                    contacts: data.contacts.filter(
                                      (contact, i) => i !== index
                                    ),
                                  });
                                }}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          )}
                          <div className="row gx-3">
                            <div className="lg:col-6 mb-4">
                              <Label>Name of Contact:</Label>
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
                                required
                                value={contact.name}
                                readOnly={isReadOnly}
                                name="name"
                                placeholder="Your answer"
                              />
                            </div>
                            <div className="lg:col-6 mb-4">
                              <Label>Relation:</Label>
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
                                required
                                readOnly={isReadOnly}
                                value={contact.relation}
                                name="relation"
                                placeholder="Your answer"
                              />
                            </div>
                            <div className="lg:col-6 mb-4">
                              <Label>Phone:</Label>
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
                                required
                                readOnly={isReadOnly}
                                name="phone"
                                value={contact.phone}
                                placeholder="Your answer"
                              />
                            </div>
                          </div>

                          {isReadOnly && contacts.length - 1 !== index && (
                            <Separator className="my-6 lg:col-span-2" />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="py-4">
                      No contacts available. Please add a contact to view
                    </p>
                  )}
                  {!isReadOnly && (
                    <Button
                      variant="outline"
                      className="w-full mt-6"
                      onClick={() => {
                        handleChange({
                          ...data,
                          contacts: [
                            ...(data?.contacts ?? []),
                            {
                              name: "",
                              phone: "",
                              relation: "",
                            },
                          ],
                        });
                      }}
                      type="button"
                      disabled={isReadOnly}
                    >
                      Add Contact
                    </Button>
                  )}
                </form>
              );
            }}
          </EditFrom>
        </div>
      )}
    </div>
  );
}
