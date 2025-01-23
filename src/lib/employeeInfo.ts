import { store } from "@/redux/store";

interface Employee {
  id: string;
  name: string;
  work_email: string;
  department: string;
  designation: string;
}

const getEmployeesData = () => {
  const employees = store.getState().api.queries[
    "getEmployeesBasics(undefined)"
  ] as {
    data: {
      result: Employee[];
    };
  };
  return employees?.data?.result;
};

export const employeeInfoById = (id: string) => {
  const employees = getEmployeesData();
  const employee = employees?.find((employee) => employee.id === id);

  const fallback = {
    id,
    name: id,
    work_email: "N/A",
    department: "N/A",
    designation: "N/A",
  };

  return employee ? employee : fallback;
};

export const employeeGroupByDepartment = () => {
  const employees = getEmployeesData();
  const everyoneField = [
    {
      label: "Everyone",
      options: [{ label: "Everyone", value: "everyone" }],
    },
  ];
  const merged = employees || [];
  const result = merged.reduce((acc: any[], curr: Employee) => {
    const groupIndex = acc.findIndex((dept) => dept.label === curr.department);
    if (groupIndex !== -1) {
      acc[groupIndex].options.push({ label: curr.name, value: curr.id });
    } else {
      acc.push({
        label: curr.department || "unassigned",
        options: [{ label: curr.name, value: curr.id }],
      });
    }
    return acc;
  }, []);
  return everyoneField.concat(result);
};
