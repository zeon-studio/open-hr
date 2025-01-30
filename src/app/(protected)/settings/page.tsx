"use client";

import SettingPage from "./_components/setting-page";

const Setting = () => {
  // const { data } = useGetSettingQuery(undefined);
  // const { result: settings } = data || {};

  return (
    <section className="p-8">
      <SettingPage />
    </section>
  );
};

export default Setting;
