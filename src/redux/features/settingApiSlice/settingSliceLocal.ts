import { TSettingState } from "./settingType";

export const SETTING_SLICE_NAME = "setting-slice" as const;
export const UPDATE_SETTING = `${SETTING_SLICE_NAME}/updateSetting`;

export const initialState: TSettingState["result"] = {
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

export type UpdateSettingAction = {
  type: typeof UPDATE_SETTING;
  payload: Partial<TSettingState["result"]>;
};

export const updateSetting = (
  payload: Partial<TSettingState["result"]>,
): UpdateSettingAction => ({
  type: UPDATE_SETTING,
  payload,
});

export const settingSlice = {
  name: SETTING_SLICE_NAME,
};
