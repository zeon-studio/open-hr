import axios from "axios";
import { useMemo } from "react";

const useAxios = (_session: any) => {
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: "/api",
      withCredentials: true,
    });
  }, []);

  return axiosInstance;
};

export default useAxios;
