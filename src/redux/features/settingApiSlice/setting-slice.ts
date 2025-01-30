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
  menus: [],
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
      ? localStorage.getItem("settings")
        ? (JSON.parse(
            localStorage.getItem("settings") as string
          ) as TSettingState["result"])
        : initialState
      : initialState,
  reducers: {
    updateSetting: (state, action: PayloadAction<TSettingState["result"]>) => {
      state = action.payload;
      localStorage.setItem("settings", JSON.stringify(state));
    },
  },
});

export const { updateSetting } = settingSlice.actions;
