import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { store } from "@/redux/store";

const STORAGE_KEY = "local-employees-basics";

// Track the last `result` reference we synced to localStorage so we only
// JSON.stringify and write when the underlying data actually changes.
// Without this, every consumer call (often inside .map() loops on lists)
// stringified and rewrote the entire roster — N writes per render.
let lastWrittenRef: unknown = undefined;

const getEmployeesData = (): Partial<TEmployee>[] => {
  const employees = store.getState().api.queries[
    "getEmployeesBasics(undefined)"
  ] as {
    data: {
      result: Partial<TEmployee>[];
    };
  };

  // localStorage is unavailable during SSR; return whatever the in-memory
  // store has (empty array on first server pass).
  if (typeof window === "undefined") {
    return employees?.data?.result ?? [];
  }

  const result = employees?.data?.result;
  if (result) {
    if (result !== lastWrittenRef) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        lastWrittenRef = result;
      } catch {
        // quota exceeded or private mode — stay in memory
      }
    }
    return result;
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
