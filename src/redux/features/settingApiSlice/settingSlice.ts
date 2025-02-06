import { apiSlice } from "../apiSlice/apiSlice";
import { updateSetting } from "./settingSliceLocal";
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
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateSetting(data.result));
        } catch (error) {
          console.log(error);
        }
      },
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

    updateSettingModuleStatus: builder.mutation({
      query: (data) => {
        return {
          url: `/setting/update-module`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["settings"],
    }),
  }),
});

export const {
  useGetSettingQuery,
  useUpdateSettingMutation,
  useUpdateSettingModuleStatusMutation,
} = settingApi;
