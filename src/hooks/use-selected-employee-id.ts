import { useAppState } from "@/shared/lib/app-context";

export const useSelectedEmployeeId = () => {
  const { state } = useAppState();
  return state.custom.id;
};
