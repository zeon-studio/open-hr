import axios from "axios";
import { useMemo } from "react";

const useAxios = (session: any) => {
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: "/api",
      withCredentials: true,
    });
  }, [session?.data?.user?.id]);

  return axiosInstance;
};

export default useAxios;
