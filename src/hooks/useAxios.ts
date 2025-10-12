import axios from "axios";
import { useMemo } from "react";

const useAxios = (session: any) => {
  const axiosInstance = useMemo(() => {
    const BackendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    return axios.create({
      baseURL: BackendURL,
      headers: {
        authorization: `Bearer ${session?.data?.user.accessToken}`,
      },
    });
  }, [session]);

  return axiosInstance;
};

export default useAxios;
