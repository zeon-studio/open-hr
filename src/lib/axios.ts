import axios from "axios";
import { signOut } from "next-auth/react";

const Axios = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

Axios.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error?.message;

    if (
      status === 401 ||
      status === 403 ||
      /jwt expired/i.test(String(message)) ||
      /token verification failed/i.test(String(message)) ||
      /invalid token/i.test(String(message)) ||
      /user is not authenticated/i.test(String(message))
    ) {
      signOut({ callbackUrl: "/login" });
    }

    return Promise.reject(error);
  },
);

export default Axios;
