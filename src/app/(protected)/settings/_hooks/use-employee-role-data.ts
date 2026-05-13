import { useEffect, useState } from "react";
import { TEmployee } from "../_types/employee";

type QueryState = {
  adminAndMods: TEmployee[];
  employees: TEmployee[];
  isLoading: boolean;
  isError: boolean;
};

export const useEmployeeRoleData = () => {
  const [state, setState] = useState<QueryState>({
    adminAndMods: [],
    employees: [],
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const [adminAndModsRes, employeesRes] = await Promise.all([
          fetch("/api/employee/admin-and-mods", {
            method: "GET",
            credentials: "include",
          }),
          fetch("/api/employee/basics", {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (!adminAndModsRes.ok || !employeesRes.ok) {
          throw new Error("Failed to load employee data");
        }

        const [adminAndModsPayload, employeesPayload] = (await Promise.all([
          adminAndModsRes.json(),
          employeesRes.json(),
        ])) as [{ result?: TEmployee[] }, { result?: TEmployee[] }];

        if (mounted) {
          setState({
            adminAndMods: adminAndModsPayload.result || [],
            employees: employeesPayload.result || [],
            isLoading: false,
            isError: false,
          });
        }
      } catch {
        if (mounted) {
          setState({
            adminAndMods: [],
            employees: [],
            isLoading: false,
            isError: true,
          });
        }
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
};
