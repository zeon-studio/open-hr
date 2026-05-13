import {
  initialCustomState,
  initialFilterState,
  initialSettingState,
  type AppDispatch,
  type RootState,
} from "@/lib/app-state";

const fallbackState: RootState = {
  filter: initialFilterState,
  custom: initialCustomState,
  "setting-slice": initialSettingState,
};

export const store = {
  getState: () => fallbackState,
  dispatch: ((action: unknown) => action) as AppDispatch,
  subscribe: () => () => undefined,
};

export type { AppDispatch, RootState };
