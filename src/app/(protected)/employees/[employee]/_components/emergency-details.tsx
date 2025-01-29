import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/shadcn";
import EditFrom from "@/partials/EditFrom";
import {
  useAddEmployeeContactMutation,
  useGetEmployeeContactQuery,
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
    useAddEmployeeContactMutation();
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
                        <div key={index}>
                          <div className="bg-light p-5 rounded grid lg:grid-cols-2 gap-4 relative">
                            {session?.user.role !== "user" && !isReadOnly && (
                              <div className="lg:col-span-2 absolute right-3 top-3">
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
                            <div>
                              <Label>Name of Emergency Contact</Label>
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
                            <div>
                              <Label>Relation</Label>
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
                            <div>
                              <Label>Phone</Label>
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
                    <div className="text-right mt-6">
                      <Button
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
                        {isReadOnly ? "Add Contact" : "Add Another Contact"}
                      </Button>
                    </div>
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
