export type TMenuItem = {
  name: string; // Changed from number to string
  url: string;
  access: ("admin" | "user" | "moderator")[];
};

export type TLeaveItem = {
  name: string;
  days: number;
};

export type TTaskItem = {
  name: string;
  assigned_to: string;
  status: "pending" | "completed";
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
  menus: TMenuItem[];
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
