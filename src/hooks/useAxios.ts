import axios from "axios";
import { useMemo } from "react";

const useAxios = (session: any) => {
  const axiosInstance = useMemo(() => {
    const Token = process.env.NEXT_PUBLIC_BEARER_TOKEN;
    const BackendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    return axios.create({
      baseURL: BackendURL,
      headers: {
        authorization: `Bearer ${session?.data?.user.accessToken}`,
        authorization_token: `Bearer ${Token}`,
      },
    });
  }, [session]);

  return axiosInstance;
};

export default useAxios;
