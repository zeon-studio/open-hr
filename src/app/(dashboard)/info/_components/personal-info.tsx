import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditFrom from "@/partials/EditFrom";
import { useGetEmployeeQuery } from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { useSession } from "next-auth/react";

export default function PersonalInfo() {
  const { data: session } = useSession();
  const { data } = useGetEmployeeQuery(session?.user.id!);

  return (
    <div>
      <EditFrom<TEmployee> data={data?.result!}>
        {({ handleChange, isReadOnly, data }) => {
          return (
            <form>
              <div className="grid grid-cols-2">
                <div>
                  <Label>First Name:</Label>
                  <Input readOnly={isReadOnly} name="email" />
                </div>
              </div>
            </form>
          );
        }}
      </EditFrom>
    </div>
  );
}
