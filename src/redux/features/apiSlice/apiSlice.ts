import { TError } from "@/types";
import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import axios, { AxiosRequestConfig } from "axios";
import { getSession, signOut, type Session } from "next-auth/react";

const BackendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Module-scoped session cache. NextAuth's getSession() always hits
// /api/auth/session — there is no in-memory cache. With every RTK Query
// call invoking getSession() at the top of its baseQuery, a single page
// load that triggers N queries fired N round-trips to /api/auth/session
// (the "8 rapid-fire session calls" from the perf audit).
//
// Cache the in-flight promise so a render burst dedupes to one request,
// and refresh after a short TTL so a real session change (sign-out via
// 401, manual update) propagates within seconds.
const SESSION_CACHE_TTL_MS = 30_000;
let cachedSessionPromise: Promise<Session | null> | null = null;
let cachedAt = 0;

const getCachedSession = (): Promise<Session | null> => {
  const now = Date.now();
  if (!cachedSessionPromise || now - cachedAt > SESSION_CACHE_TTL_MS) {
    cachedSessionPromise = getSession();
    cachedAt = now;
  }
  return cachedSessionPromise;
};

const invalidateCachedSession = () => {
  cachedSessionPromise = null;
  cachedAt = 0;
};

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
    const session = await getCachedSession();
    const { url, method, body, params, headers } = args;
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data: body,
        params,
        headers: {
          authorization: `Bearer ${session?.user.accessToken}`,
          ...headers,
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as TError;
      if (err.response?.data && err.response?.status === 401) {
        // The cached token is stale. Drop it so the next request
        // refetches a fresh session before we sign the user out.
        invalidateCachedSession();
        signOut();
      }
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
