import { useAppState } from "@/shared/lib/app-context";

export const usePaginationFilter = () => {
  const { state } = useAppState();
  return state.filter;
};
