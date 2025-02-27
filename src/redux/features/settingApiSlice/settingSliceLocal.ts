import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TSettingState } from "./settingType";

const initialState: TSettingState["result"] = {
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

export const settingSlice = createSlice({
  name: "setting-slice",
  initialState:
    typeof window !== "undefined"
      ? localStorage.getItem("local-settings")
        ? (JSON.parse(
            localStorage.getItem("local-settings") as string
          ) as TSettingState["result"])
        : initialState
      : initialState,
  reducers: {
    updateSetting: (state, action: PayloadAction<TSettingState["result"]>) => {
      localStorage.setItem(
        "local-settings",
        JSON.stringify({
          ...state,
          ...action.payload,
        })
      );
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateSetting } = settingSlice.actions;
