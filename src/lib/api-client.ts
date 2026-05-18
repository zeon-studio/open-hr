import Axios from "@/lib/axios";
import { TError } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ApiRequestArgs = {
  url: string;
  method?: string;
  body?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
};

export type QueryOptions = {
  skip?: boolean;
  tags?: string[];
};

const inFlightRequests = new Map<string, Promise<any>>();

const tagListeners = new Map<string, Set<() => void>>();

export const subscribeToTag = (tag: string, cb: () => void) => {
  if (!tagListeners.has(tag)) tagListeners.set(tag, new Set());
  tagListeners.get(tag)!.add(cb);
  return () => tagListeners.get(tag)?.delete(cb);
};

export const invalidateTags = (tags: string[]) => {
  tags.forEach((tag) => tagListeners.get(tag)?.forEach((cb) => cb()));
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
  const isReadOnly = !method || method.toUpperCase() === "GET";
  const cacheKey = isReadOnly ? `${method}:${url}:${JSON.stringify(params)}` : null;

  if (cacheKey && inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey) as Promise<TData>;
  }

  const request = (Axios({ url, method, data: body, params, headers }) as Promise<{ data: TData }>)
    .then((result) => result.data)
    .catch((axiosError: unknown) => {
      const err = axiosError as TError;
      throw { status: err.response?.status, data: err.response?.data || err.message };
    })
    .finally(() => {
      if (cacheKey) inFlightRequests.delete(cacheKey);
    });

  if (cacheKey) inFlightRequests.set(cacheKey, request);
  return request;
};

export const createQueryHook = <TData, TArg = undefined>(
  request: (arg: TArg) => Promise<TData>,
  defaultTags?: string[],
) => {
  return (arg: TArg, options?: QueryOptions) => {
    const skip = Boolean(options?.skip);
    const tags = options?.tags ?? defaultTags;
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

    useEffect(() => {
      if (!tags?.length) return;
      const unsubs = tags.map((tag) => subscribeToTag(tag, () => fetchData().catch(() => undefined)));
      return () => unsubs.forEach((unsub) => unsub());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchData, JSON.stringify(tags)]);

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
    invalidatesTags?: string[];
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
          if (options?.invalidatesTags?.length) invalidateTags(options.invalidatesTags);
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
