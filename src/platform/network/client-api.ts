export type ClientApiError = {
  message: string;
  status?: number;
  errorMessage?: { path: string; message: string }[];
};

export async function clientApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.success === false) {
    const error: ClientApiError = {
      message: data?.message || `Request failed with status ${response.status}`,
      status: response.status,
      errorMessage: data?.errorMessage,
    };
    throw error;
  }

  return data as T;
}
