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
  const employees = getEmployeesData() || [];
  const result = employees.reduce((acc: any[], curr: Employee) => {
    const department = (curr.department || "unassigned").toUpperCase();
    const employee = {
      label: curr.name,
      value: curr.id,
      department,
    };

    const groupIndex = acc.findIndex((dept) => dept.label === department);
    if (groupIndex !== -1) {
      acc[groupIndex].options.push(employee);
    } else {
      acc.push({
        label: department,
        options: [employee],
      });
    }
    return acc;
  }, []);

  const extraFields = [
    {
      label: "COMMON",
      options: [
        { label: "No One", value: "none", department: "COMMON" },
        { label: "Everyone", value: "everyone", department: "COMMON" },
      ],
    },
  ];

  return [...result, ...extraFields];
};
