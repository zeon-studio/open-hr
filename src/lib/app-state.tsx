"use client";

import {
  FILTER_EMPLOYEE,
  type FilterEmployeeAction,
} from "@/redux/features/customSlice/customSlice";
import {
  SEARCH_FILTER,
  type SearchFilterAction,
  UPDATE_PAGE,
  type UpdatePageAction,
} from "@/redux/features/filterSlice/filterSlice";
import {
  SETTING_SLICE_NAME,
  UPDATE_SETTING,
  type UpdateSettingAction,
} from "@/redux/features/settingApiSlice/settingSliceLocal";
import type { TSettingState } from "@/redux/features/settingApiSlice/settingType";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type FilterState = {
  page: number;
  limit: number;
  search: string | number | boolean;
};

export type CustomState = {
  id: string;
};

export type RootState = {
  filter: FilterState;
  custom: CustomState;
  [SETTING_SLICE_NAME]: TSettingState["result"];
};

export type AppAction =
  | UpdatePageAction
  | SearchFilterAction
  | FilterEmployeeAction
  | UpdateSettingAction;

export type AppDispatch = (
  action:
    | AppAction
    | ((dispatch: AppDispatch, getState: () => RootState) => unknown),
) => unknown;

export const initialFilterState: FilterState = {
  page: 1,
  limit: 100,
  search: "",
};

export const initialCustomState: CustomState = {
  id: "",
};

export const initialSettingState: TSettingState["result"] = {
  app_name: "",
  app_url: "",
  favicon_url: "",
  logo_url: "",
  logo_width: 0,
  logo_height: 0,
  company_name: "",
  company_website: "",
  communication_platform: "",
  communication_platform_url: "",
  max_leave_per_day: 0,
  leave_threshold_days: 0,
  payroll: {
    basic: "",
    house_rent: "",
    conveyance: "",
    medical: "",
  },
  modules: [],
  weekends: [],
  conditional_weekends: [],
  leaves: [],
  onboarding_tasks: [],
  offboarding_tasks: [],
};

const LOCAL_SETTING_KEY = "local-settings";

const getInitialSettingState = (): TSettingState["result"] => {
  if (typeof window === "undefined") {
    return initialSettingState;
  }

  try {
    const localValue = localStorage.getItem(LOCAL_SETTING_KEY);
    if (!localValue) {
      return initialSettingState;
    }

    return {
      ...initialSettingState,
      ...(JSON.parse(localValue) as TSettingState["result"]),
    };
  } catch {
    return initialSettingState;
  }
};

const persistSetting = (setting: TSettingState["result"]) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(LOCAL_SETTING_KEY, JSON.stringify(setting));
  } catch {
    // Ignore storage write failures (quota/private mode).
  }
};

type AppStateContextValue = {
  state: RootState;
  setSetting: (value: Partial<TSettingState["result"]>) => void;
  dispatch: AppDispatch;
};

const AppStateContext = createContext<AppStateContextValue | undefined>(
  undefined,
);

export const AppStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [filter, setFilter] = useState<FilterState>(initialFilterState);
  const [custom, setCustom] = useState<CustomState>(initialCustomState);
  const [setting, setSettingState] = useState<TSettingState["result"]>(
    getInitialSettingState,
  );

  const filterRef = useRef(filter);
  const customRef = useRef(custom);
  const settingRef = useRef(setting);

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  useEffect(() => {
    customRef.current = custom;
  }, [custom]);

  useEffect(() => {
    settingRef.current = setting;
  }, [setting]);

  const getState = useCallback(
    () => ({
      filter: filterRef.current,
      custom: customRef.current,
      [SETTING_SLICE_NAME]: settingRef.current,
    }),
    [],
  );

  const setSetting = useCallback((value: Partial<TSettingState["result"]>) => {
    setSettingState((prev) => {
      const nextValue = {
        ...prev,
        ...value,
      };
      persistSetting(nextValue);
      return nextValue;
    });
  }, []);

  const dispatch = useCallback<AppDispatch>(
    (action) => {
      if (typeof action === "function") {
        return action((nextAction) => nextAction, getState);
      }

      if (!action || typeof action !== "object" || !("type" in action)) {
        return action;
      }

      switch (action.type) {
        case UPDATE_PAGE:
          setFilter((prev) => ({
            ...prev,
            page: Number(action.payload ?? 1),
          }));
          break;
        case SEARCH_FILTER:
          setFilter((prev) => ({
            ...prev,
            search: (action.payload as string | number | boolean) ?? "",
          }));
          break;
        case FILTER_EMPLOYEE:
          setCustom((prev) => ({
            ...prev,
            id: String(action.payload ?? ""),
          }));
          break;
        case UPDATE_SETTING:
          setSetting(
            (action.payload as Partial<TSettingState["result"]>) ?? {},
          );
          break;
        default:
          break;
      }

      return action;
    },
    [getState, setSetting],
  );

  const state = useMemo<RootState>(
    () => ({
      filter,
      custom,
      [SETTING_SLICE_NAME]: setting,
    }),
    [custom, filter, setting],
  );

  const value = useMemo<AppStateContextValue>(
    () => ({
      state,
      setSetting,
      dispatch,
    }),
    [dispatch, setSetting, state],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
};
