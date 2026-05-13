import { useEffect, useState } from "react";
import { TSettingState } from "../_types/setting";

type QueryState = {
  data?: TSettingState;
  isLoading: boolean;
  isError: boolean;
};

export const useSettingsQuery = () => {
  const [state, setState] = useState<QueryState>({
    data: undefined,
    isLoading: true,
    isError: false,
  });

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const response = await fetch("/api/setting", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to load settings");
        }

        const payload = (await response.json()) as TSettingState;

        if (mounted) {
          setState({
            data: payload,
            isLoading: false,
            isError: false,
          });
        }
      } catch {
        if (mounted) {
          setState({
            data: undefined,
            isLoading: false,
            isError: true,
          });
        }
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
};
