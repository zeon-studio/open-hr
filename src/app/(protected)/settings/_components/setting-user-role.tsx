import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditFrom from "@/layouts/partials/edit-from";
import {
  useGetAdminAndModsQuery,
  useGetEmployeesBasicsQuery,
  useUpdateEmployeeRoleMutation,
} from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SettingUserRole = () => {
  const { data: session } = useSession();
  const { data: adminAndModsData } = useGetAdminAndModsQuery(undefined);
  const { result: adminAndMods } = adminAndModsData || {};
  const { data: employeesData } = useGetEmployeesBasicsQuery(undefined);
  const { result: employees } = employeesData || {};

  const [loader, setLoader] = useState(false);
  const [initialData, setInitialData] = useState<Partial<TEmployee>[]>([]);
  const [updateUserRole, { isSuccess, isError, error }] =
    useUpdateEmployeeRoleMutation();

  useEffect(() => {
    if (adminAndMods) {
      setInitialData(
        adminAndMods.map(({ id, name, role }) => ({ id, name, role }))
      );
    }
  }, [adminAndMods]);

  useEffect(() => {
    if (isSuccess) {
      toast("Role update complete");
    } else if (isError) {
      toast("Something went wrong");
      console.error(error);
    }
    setLoader(false);
  }, [isSuccess, isError, error]);

  const handleSubmit = async (data: Partial<TEmployee>[]) => {
    setLoader(true);
    try {
      const payload = data.map(({ id, role }) => ({ id, role }));
      await Promise.all(payload.map(updateUserRole));
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  return (
    session?.user.role === "admin" && (
      <EditFrom<Partial<TEmployee>[]>
        isUpdating={loader}
        data={initialData}
        key={JSON.stringify(initialData)}
        title="User Role"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          const handleDelete = async (index: number) => {
            const updatedData = data.map((userRole, i) =>
              i === index
                ? {
                    ...userRole,
                    role: "user" as "user" | "moderator" | "admin",
                  }
                : userRole
            );
            const userToUpdate = updatedData.find((_, i) => i === index);
            if (userToUpdate) {
              try {
                await updateUserRole(userToUpdate);
                handleChange(
                  updatedData.filter((userRole) => userRole.role !== "user")
                );
              } catch (error) {
                console.error(error);
              }
            }
          };

          return (
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(data);
              }}
            >
              {data?.map((item, index) => (
                <div
                  key={`user-${index}`}
                  className={`${isReadOnly ? "bg-white" : "bg-light px-5 pt-5 mb-5"} ${index !== 0 && isReadOnly && "border-t pt-5"} rounded relative`}
                >
                  {!isReadOnly && (
                    <div className="absolute right-5 top-3">
                      <Button
                        type="button"
                        size={"xs"}
                        variant="outline"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  )}
                  <div className="row gx-3">
                    <div className="lg:col-6 mb-4">
                      <Label>Name:</Label>
                      {isReadOnly ? (
                        <small className="block capitalize">{item.name}</small>
                      ) : (
                        <Select
                          value={item.name || ""}
                          onValueChange={(value) => {
                            const selectedEmployee = employees?.find(
                              (employee) => employee.name === value
                            );
                            handleChange(
                              data.map((userRole, i) =>
                                i === index
                                  ? {
                                      ...userRole,
                                      id: selectedEmployee?.id || "",
                                      name: value,
                                    }
                                  : userRole
                              )
                            );
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Name" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees?.map((employee) => (
                              <SelectItem
                                key={employee.id}
                                value={employee.name}
                              >
                                {employee.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="lg:col-6 mb-4">
                      <Label>Role:</Label>
                      {isReadOnly ? (
                        <small className="block capitalize">{item.role}</small>
                      ) : (
                        <Select
                          value={item.role || ""}
                          onValueChange={(value) =>
                            handleChange(
                              data.map((userRole, i) =>
                                i === index
                                  ? {
                                      ...userRole,
                                      role: value as
                                        | "user"
                                        | "moderator"
                                        | "admin",
                                    }
                                  : userRole
                              )
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {!isReadOnly && (
                <Button
                  variant="outline"
                  className="w-full mt-6"
                  type="button"
                  onClick={() => {
                    handleChange([
                      ...data,
                      {
                        id: `${data.length}-${Date.now()}`,
                        name: "",
                        role: "moderator",
                      },
                    ]);
                  }}
                >
                  Add New
                </Button>
              )}
            </form>
          );
        }}
      </EditFrom>
    )
  );
};

export default SettingUserRole;
