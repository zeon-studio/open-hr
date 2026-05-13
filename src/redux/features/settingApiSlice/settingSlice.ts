import { useAppState } from "@/lib/app-state";
import { useEffect } from "react";
import {
  apiRequest,
  createMutationHook,
  createQueryHook,
} from "../apiSlice/apiSlice";
import { TSettingState } from "./settingType";

const useGetSettingQueryBase = createQueryHook<TSettingState, undefined>(() =>
  apiRequest<TSettingState>({
    url: `/setting`,
    method: "GET",
  }),
);

export const useGetSettingQuery = (
  arg: undefined,
  options?: { skip?: boolean },
) => {
  const query = useGetSettingQueryBase(arg, options);
  const { setSetting } = useAppState();

  useEffect(() => {
    if (query.data?.result) {
      setSetting(query.data.result);
    }
  }, [query.data, setSetting]);

  return query;
};

export const useUpdateSettingMutation = createMutationHook<any, any>((data) =>
  apiRequest({
    url: `/setting`,
    method: "PATCH",
    body: data,
  }),
);

export const useUpdateSettingModuleStatusMutation = createMutationHook<
  any,
  any
>((data) =>
  apiRequest({
    url: `/setting/update-module`,
    method: "PATCH",
    body: data,
  }),
);
