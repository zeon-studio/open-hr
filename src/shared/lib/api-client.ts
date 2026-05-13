import { Axios } from "@/platform/network";
import { TError } from "@/types";
import type { AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ApiRequestArgs = {
  url: string;
  method: AxiosRequestConfig["method"];
  body?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
};

export type QueryOptions = {
  skip?: boolean;
};

type QueryState<TData> = {
  data?: TData;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: unknown;
};

type MutationState<TData> = {
  data?: TData;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: unknown;
};

type TriggerResult<TData> = Promise<{ data: TData } | { error: unknown }> & {
  unwrap: () => Promise<TData>;
};

export const apiRequest = async <TData>({
  url,
  method,
  body,
  params,
  headers,
}: ApiRequestArgs): Promise<TData> => {
  try {
    const result = await Axios({
      url,
      method,
      data: body,
      params,
      headers,
    });

    return result.data as TData;
  } catch (axiosError) {
    const err = axiosError as TError;
    throw {
      status: err.response?.status,
      data: err.response?.data || err.message,
    };
  }
};

export const createQueryHook = <TData, TArg = undefined>(
  request: (arg: TArg) => Promise<TData>,
) => {
  return (arg: TArg, options?: QueryOptions) => {
    const skip = Boolean(options?.skip);
    const [state, setState] = useState<QueryState<TData>>({
      data: undefined,
      isLoading: !skip,
      isFetching: !skip,
      isSuccess: false,
      isError: false,
      error: undefined,
    });

    const serializedArg = useMemo(() => JSON.stringify(arg ?? null), [arg]);
    const dataRef = useRef<TData | undefined>(state.data);

    useEffect(() => {
      dataRef.current = state.data;
    }, [state.data]);

    const fetchData = useCallback(async () => {
      if (skip) {
        return dataRef.current;
      }

      setState((prev) => ({
        ...prev,
        isLoading: prev.data === undefined,
        isFetching: true,
        isError: false,
        error: undefined,
      }));

      try {
        const parsedArg = JSON.parse(serializedArg) as TArg;
        const data = await request(parsedArg);
        setState({
          data,
          isLoading: false,
          isFetching: false,
          isSuccess: true,
          isError: false,
          error: undefined,
        });
        return data;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isFetching: false,
          isSuccess: false,
          isError: true,
          error,
        }));
        throw error;
      }
    }, [skip, serializedArg]);

    useEffect(() => {
      if (skip) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isFetching: false,
        }));
        return;
      }

      fetchData().catch(() => undefined);
    }, [fetchData, skip]);

    const refetch = useCallback(async () => fetchData(), [fetchData]);

    return {
      ...state,
      refetch,
    };
  };
};

export const createMutationHook = <TData, TArg = unknown>(
  request: (arg: TArg) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, arg: TArg) => void;
    onError?: (error: unknown, arg: TArg) => void;
  },
) => {
  return () => {
    const [state, setState] = useState<MutationState<TData>>({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: undefined,
    });

    const trigger = useCallback((arg: TArg): TriggerResult<TData> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: undefined,
      }));

      const execution = request(arg)
        .then((data) => {
          setState({
            data,
            isLoading: false,
            isSuccess: true,
            isError: false,
            error: undefined,
          });
          options?.onSuccess?.(data, arg);
          return data;
        })
        .catch((error) => {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isSuccess: false,
            isError: true,
            error,
          }));
          options?.onError?.(error, arg);
          throw error;
        });

      const wrapped = execution
        .then((data) => ({ data }))
        .catch((error) => ({ error })) as TriggerResult<TData>;

      wrapped.unwrap = () => execution;
      return wrapped;
    }, []);

    return [trigger, state] as const;
  };
};
