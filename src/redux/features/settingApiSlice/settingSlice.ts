import { apiSlice } from "../apiSlice/apiSlice";
import { TSettingState } from "./settingType";

const settingApiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["settings"],
});

export const settingApi = settingApiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    getSetting: builder.query<TSettingState, undefined>({
      query: () => ({
        url: `/setting`,
        method: "GET",
      }),
      providesTags: ["settings"],
    }),

    updateSetting: builder.mutation({
      query: (data) => {
        return {
          url: `/setting`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["settings"],
    }),
  }),
});

export const { useGetSettingQuery, useUpdateSettingMutation } = settingApi;
