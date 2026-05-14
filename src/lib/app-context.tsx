"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ============================================================================
// Action Type Constants
// ============================================================================

const FILTER_SLICE_NAME = "filter";
const UPDATE_PAGE = `${FILTER_SLICE_NAME}/updatePage`;
const SEARCH_FILTER = `${FILTER_SLICE_NAME}/search`;

const CUSTOM_SLICE_NAME = "custom";
const FILTER_EMPLOYEE = `${CUSTOM_SLICE_NAME}/filterEmployee`;

const SETTING_SLICE_NAME = "setting-slice" as const;
const UPDATE_SETTING = `${SETTING_SLICE_NAME}/updateSetting`;

// ============================================================================
// Setting Types
// ============================================================================

export type TModuleItem = {
  name: string;
  enable: boolean;
};

export type TLeaveItem = {
  name: "earned" | "sick" | "casual" | "without_pay";
  days: number;
};

export type TTaskItem = {
  name: string;
  assigned_to: string;
};

export type TConditionalWeekend = {
  name: string;
  pattern: number[];
};

export type TPayrollSetting = {
  basic: string;
  house_rent: string;
  conveyance: string;
  medical: string;
};

export type TSetting = {
  app_name: string;
  app_url: string;
  favicon_url: string;
  logo_url: string;
  logo_width: number;
  logo_height: number;
  company_name: string;
  company_website: string;
  communication_platform: string;
  communication_platform_url: string;
  max_leave_per_day: number;
  leave_threshold_days: number;
  modules: TModuleItem[];
  weekends: string[];
  conditional_weekends: TConditionalWeekend[];
  leaves: TLeaveItem[];
  payroll: TPayrollSetting;
  onboarding_tasks: TTaskItem[];
  offboarding_tasks: TTaskItem[];
};

// ============================================================================
// Action Types
// ============================================================================

export type UpdatePageAction = {
  type: typeof UPDATE_PAGE;
  payload: number;
};

export type SearchFilterAction = {
  type: typeof SEARCH_FILTER;
  payload: string | number | boolean;
};

export type FilterEmployeeAction = {
  type: typeof FILTER_EMPLOYEE;
  payload: string;
};

export type UpdateSettingAction = {
  type: typeof UPDATE_SETTING;
  payload: Partial<TSetting>;
};

// ============================================================================
// State Types
// ============================================================================

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
  [SETTING_SLICE_NAME]: TSetting;
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

export const initialSettingState: TSetting = {
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


const persistSetting = (setting: TSetting) => {
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
  setSetting: (value: Partial<TSetting>) => void;
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
  const [setting, setSettingState] = useState<TSetting>(initialSettingState);

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

  // Load settings from localStorage after initial mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const localValue = localStorage.getItem(LOCAL_SETTING_KEY);
      if (localValue) {
        const parsed = JSON.parse(localValue) as TSetting;
        setSettingState((prev) => ({
          ...prev,
          ...parsed,
        }));
      }
    } catch {
      // Ignore localStorage read failures.
    }
  }, []);

  const getState = useCallback(
    () => ({
      filter: filterRef.current,
      custom: customRef.current,
      [SETTING_SLICE_NAME]: settingRef.current,
    }),
    [],
  );

  const setSetting = useCallback((value: Partial<TSetting>) => {
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
          setSetting((action.payload as Partial<TSetting>) ?? {});
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
