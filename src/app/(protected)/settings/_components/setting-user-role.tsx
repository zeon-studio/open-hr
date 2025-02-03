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

  const [updateUserRole, { isSuccess, isError, error }] =
    useUpdateEmployeeRoleMutation();

  const handleSubmit = async (data: Partial<TEmployee>[]) => {
    setLoader(true);
    try {
      const payload = data.map(({ id, role }) => ({ id, role }));
      for (const userRole of payload) {
        await updateUserRole(userRole);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      toast("Role update complete");
    } else if (isError) {
      setLoader(false);
      toast("Something went wrong");
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  const [initialData, setInitialData] = useState<Partial<TEmployee>[]>([]);

  useEffect(() => {
    if (adminAndMods) {
      setInitialData(
        adminAndMods.map((item) => ({
          id: item.id,
          name: item.name,
          role: item.role,
        }))
      );
    }
  }, [adminAndMods]);

  return (
    session?.user.role === "admin" && (
      <EditFrom<Partial<TEmployee>[]>
        isUpdating={loader}
        data={initialData}
        key={JSON.stringify(initialData)}
        title="User Role"
      >
        {({ handleChange, isReadOnly, data, formRef }) => (
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(data);
            }}
          >
            {data?.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className={`${isReadOnly ? "bg-white" : "bg-light px-5 pt-5 mb-5"} ${index !== 0 && isReadOnly && "border-t pt-5"} rounded relative`}
              >
                {!isReadOnly && (
                  <div className="absolute right-5 top-3">
                    <Button
                      type="button"
                      size={"xs"}
                      variant="outline"
                      onClick={() => {
                        handleChange(
                          data
                            .map((userRole, i) =>
                              i === index
                                ? {
                                    ...userRole,
                                    role: "user" as
                                      | "user"
                                      | "moderator"
                                      | "admin",
                                  }
                                : userRole
                            )
                            .filter((userRole) => userRole.role !== "user")
                        );
                      }}
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
                            <SelectItem key={employee.id} value={employee.name}>
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
                      role: "moderator" as const,
                    },
                  ]);
                }}
              >
                Add New
              </Button>
            )}
          </form>
        )}
      </EditFrom>
    )
  );
};

export default SettingUserRole;
