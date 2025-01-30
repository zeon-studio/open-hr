"use client";

import { useGetSettingQuery } from "@/redux/features/settingApiSlice/settingSlice";

const Setting = () => {
  const { data } = useGetSettingQuery(undefined);
  const { result: settings } = data || {};

  console.log(settings);

  // const { localData } = useLocalCacheHook(
  //   {
  //     data: settings!,
  //   },
  //   "erp-settings"
  // );

  return <section className="p-8"></section>;
};

export default Setting;
