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

export type TSettingState = {
  loading: boolean;
  result: TSetting;
  error: boolean;
};
