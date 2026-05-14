import { useAppState } from "@/lib/app-context";

export const useSettings = () => {
  const { state } = useAppState();
  return state["setting-slice"];
};
