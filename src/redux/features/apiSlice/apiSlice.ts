import { TError } from "@/types";
import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import axios, { AxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const Token = process.env.NEXT_PUBLIC_BEARER_TOKEN;
const BackendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      body?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async (args) => {
    const session = await getSession();
    const { url, method, body, params, headers } = args;
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data: body,
        params,
        // withCredentials: true,
        headers: {
          authorization: `Bearer ${session?.user.accessToken}`,
          authorization_token: `Bearer ${Token}`,
          ...headers,
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as TError;
      // if (err.response?.data && err.response?.status === 401) {
      //   signOut();
      // }
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: BackendURL as string,
  }),
  endpoints: () => ({}),
});
