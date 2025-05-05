import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";

function formatDepartment(department?: string) {
  if (!department) return "N/A";
  return department
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" & ");
}

export function getAppointmentLetterHtml(employee: TEmployee) {
  const designation = employee.designation || "N/A";
  const department = formatDepartment(employee.department);
  return `
    <div>
      <h2>Appointment Letter</h2>
      <p>
        This is to certify that <b>${employee.name || "N/A"}</b> has been
        appointed as <b>${designation}</b> in the
        <b>${department}</b> department.
      </p>
      <p>
        Date of Joining:
        ${
          employee.createdAt
            ? new Date(employee.createdAt).toLocaleDateString()
            : "N/A"
        }
      </p>
    </div>
  `;
}

export default function EmployeeAppointmentLetter({
  employee,
}: {
  employee: TEmployee;
}) {
  const designation = employee.designation || "N/A";
  const department = formatDepartment(employee.department);

  return (
    <div>
      <h2>Appointment Letter</h2>
      <p>
        This is to certify that <b>{employee.name || "N/A"}</b> has been
        appointed as <b>{designation}</b> in the <b>{department}</b> department.
      </p>
      <p>
        Date of Joining:{" "}
        {employee.createdAt
          ? new Date(employee.createdAt).toLocaleDateString()
          : "N/A"}
      </p>
    </div>
  );
}
