import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { store } from "@/redux/store";

const getEmployeesData = () => {
  const employees = store.getState().api.queries[
    "getEmployeesBasics(undefined)"
  ] as {
    data: {
      result: Partial<TEmployee>[];
    };
  };

  const storedData = localStorage.getItem("local-employees-basics");
  if (employees?.data?.result) {
    localStorage.setItem(
      "local-employees-basics",
      JSON.stringify(employees.data.result)
    );
    return employees.data.result;
  }

  return storedData ? JSON.parse(storedData) : [];
};

export const employeeInfoById = (id: string) => {
  const employees = getEmployeesData();
  const employee: Partial<TEmployee> | undefined = employees?.find(
    (employee: Partial<TEmployee>) => employee.id === id
  );

  // @ts-ignore
  const fallback = {
    id,
    name: id,
    work_email: "N/A",
    department: "N/A",
    designation: "N/A",
  } as Partial<TEmployee>;

  return employee ? employee : fallback;
};

export const employeeGroupByDepartment = () => {
  const employees = getEmployeesData() || [];
  const filterFormerEmployees = employees.filter(
    (employee: Partial<TEmployee>) => employee.role !== "former"
  );

  const result = filterFormerEmployees.reduce(
    (acc: any[], curr: Partial<TEmployee>) => {
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
    },
    []
  );

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
