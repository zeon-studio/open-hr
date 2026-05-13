import { TEmployee } from "@/types/domain/employee";

const STORAGE_KEY = "local-employees-basics";

const getEmployeesData = (): Partial<TEmployee>[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const employeeInfoById = (id: string) => {
  const employees = getEmployeesData();
  const employee: Partial<TEmployee> | undefined = employees?.find(
    (employee: Partial<TEmployee>) => employee.id === id,
  );

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
    (employee: Partial<TEmployee>) => employee.role !== "former",
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
    [],
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
