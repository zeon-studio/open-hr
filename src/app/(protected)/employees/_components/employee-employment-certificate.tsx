import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";

function formatDepartment(department?: string) {
  if (!department) return "N/A";
  return department
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" & ");
}

export function getEmploymentCertificateHtml(employee: TEmployee) {
  const designation = employee.designation || "N/A";
  const department = formatDepartment(employee.department);
  return `
    <div>
      <h2>Employment Certificate</h2>
      <p>
        This is to certify that <b>${employee.name || "N/A"}</b> was employed as <b>${designation}</b> in the <b>${department}</b> department.
      </p>
      <p>Employment Status: ${employee.status || "N/A"}</p>
    </div>
  `;
}

export default function EmployeeEmploymentCertificate({
  employee,
}: {
  employee: TEmployee;
}) {
  const designation = employee.designation || "N/A";
  const department = formatDepartment(employee.department);

  return (
    <div>
      <h2>Employment Certificate</h2>
      <p>
        This is to certify that <b>{employee.name || "N/A"}</b> was employed as{" "}
        <b>{designation}</b> in the <b>{department}</b> department.
      </p>
      <p>Employment Status: {employee.status || "N/A"}</p>
    </div>
  );
}
