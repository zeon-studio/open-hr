import { useAppState, type AppDispatch, type RootState } from "@/lib/app-state";

export const useAppDispatch = (): AppDispatch => {
  const { dispatch } = useAppState();
  return dispatch;
};

export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected,
): TSelected => {
  const { state } = useAppState();
  return selector(state);
};
