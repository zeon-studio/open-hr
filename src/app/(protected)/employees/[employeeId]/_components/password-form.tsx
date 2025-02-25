import EditForm from "@/partials/edit-from";
import { TEmployeePasswordUpdate } from "@/redux/features/employeeApiSlice/employeeType";
import { Label } from "@/ui/label";
import PasswordInput from "@/ui/password-input";

export default function PasswordForm({
  data,
  isUpdating,
  onSubmit,
}: {
  data: TEmployeePasswordUpdate;
  isUpdating: boolean;
  onSubmit: (data: TEmployeePasswordUpdate) => void;
}) {
  return (
    <EditForm<TEmployeePasswordUpdate>
      isUpdating={isUpdating}
      data={data}
      title="Password Management"
    >
      {({ handleChange, isReadOnly, data, formRef }) => (
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(data);
          }}
          className="row gap-y-4"
        >
          {isReadOnly ? (
            <div className="lg:col-12">
              <p className="text-sm">Update Your Password</p>
            </div>
          ) : (
            <>
              <div className="lg:col-6">
                <Label>Current Password:</Label>
                <PasswordInput
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="password"
                  value={data.current_password || ""}
                  name="current_password"
                  placeholder="Current Password"
                  readOnly={isReadOnly}
                />
              </div>

              <div className="lg:col-6">
                <Label>New Password:</Label>
                <PasswordInput
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="password"
                  value={data.new_password || ""}
                  name="new_password"
                  placeholder="New Password"
                  readOnly={isReadOnly}
                />
              </div>
            </>
          )}
        </form>
      )}
    </EditForm>
  );
}
