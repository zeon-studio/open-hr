import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/shadcn";
import EditFrom from "@/partials/EditFrom";
import {
  useGetEmployeeContactQuery,
  useUpdateEmployeeContactMutation,
} from "@/redux/features/employeeContactApiSlice/employeeContactSlice";
import { TEmployeeContact } from "@/redux/features/employeeContactApiSlice/employeeContactType";
import { Loader2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function Emergency() {
  const { data: session } = useSession();
  let { employeeId } = useParams<{ employeeId: string }>();
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }
  const [addContact, { isLoading: isAddLoading }] =
    useUpdateEmployeeContactMutation();
  const { data, isLoading } = useGetEmployeeContactQuery(employeeId);

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
                  className="grid"
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
                            <div className="absolute top-3 right-5">
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
                                className={cn(isReadOnly && "bg-transparent")}
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
                                className={cn(isReadOnly && "bg-transparent")}
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
                                className={cn(isReadOnly && "bg-transparent")}
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

                          {contacts.length - 1 !== index && (
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
