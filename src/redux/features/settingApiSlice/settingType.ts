export type TModuleItem = {
  name:
    | "tool"
    | "course"
    | "asset"
    | "leave"
    | "calendar"
    | "employee-bank"
    | "employee-payroll"
    | "employee-contact"
    | "employee-document"
    | "employee-boarding"
    | "employee-education"
    | "employee-achievement";
  description: string;
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

export type TSetting = {
  app_name: string;
  app_url: string;
  favicon_url: string;
  logo_url: string;
  logo_width: number;
  logo_height: number;
  company_name: string;
  company_website: string;
  modules: TModuleItem[];
  weekends: string[];
  conditional_weekends: TConditionalWeekend[];
  leaves: TLeaveItem[];
  onboarding_tasks: TTaskItem[];
  offboarding_tasks: TTaskItem[];
};

export type TSettingState = {
  loading: boolean;
  result: TSetting;
  error: boolean;
};
