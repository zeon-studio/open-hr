import { useAppState } from "@/lib/app-context";

export const useSelectedEmployeeId = () => {
  const { state } = useAppState();
  return state.custom.id;
};
