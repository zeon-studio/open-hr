import { apiRequest, subscribeToTag } from "@/lib/api-client";
import { TEmployee, TEmployeeState } from "@/types/employee";
import { useEffect, useMemo, useState } from "react";

let cachedData: TEmployeeState | undefined;
let inflightPromise: Promise<TEmployeeState> | undefined;
const subscribers = new Set<() => void>();

const fetchBasics = (force = false): Promise<TEmployeeState> => {
  if (cachedData && !force) return Promise.resolve(cachedData);
  if (inflightPromise) return inflightPromise;

  inflightPromise = apiRequest<TEmployeeState>({
    url: "/employee/basics",
    method: "GET",
  }).then((data) => {
    cachedData = data;
    inflightPromise = undefined;
    subscribers.forEach((cb) => cb());
    return data;
  });

  return inflightPromise;
};

const useBasicsData = () => {
  const [data, setData] = useState<TEmployeeState | undefined>(cachedData);

  useEffect(() => {
    if (cachedData) {
      setData(cachedData);
      return;
    }
    const notify = () => setData(cachedData);
    subscribers.add(notify);
    fetchBasics().catch(() => undefined);
    return () => {
      subscribers.delete(notify);
    };
  }, []);

  useEffect(() => {
    const notify = () => {
      cachedData = undefined;
      fetchBasics(true).catch(() => undefined);
      setData(cachedData);
    };
    const unsubscribe = subscribeToTag("employee-basics", notify);
    return () => {
      unsubscribe();
    };
  }, []);

  return data;
};

export const useEmployeeMap = () => {
  const data = useBasicsData();
  return useMemo(() => {
    const map = new Map<string, Partial<TEmployee>>();
    (data?.result ?? []).forEach((e: Partial<TEmployee>) => {
      if (e.id) map.set(e.id, e);
    });
    return map;
  }, [data]);
};

export const useEmployeeGroupByDepartment = () => {
  const data = useBasicsData();
  return useMemo(() => {
    const employees: Partial<TEmployee>[] = data?.result ?? [];
    const active = employees.filter((e) => e.role !== "former");

    const groups = active.reduce((acc: any[], curr) => {
      const dept = (curr.department || "unassigned").toUpperCase();
      const opt = { label: curr.name, value: curr.id, department: dept };
      const g = acc.find((d) => d.label === dept);
      if (g) g.options.push(opt);
      else acc.push({ label: dept, options: [opt] });
      return acc;
    }, []);

    return [
      ...groups,
      {
        label: "COMMON",
        options: [
          { label: "No One", value: "none", department: "COMMON" },
          { label: "Everyone", value: "everyone", department: "COMMON" },
        ],
      },
    ];
  }, [data]);
};
