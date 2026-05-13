import { ErrorResponse } from "@/types";
import { toast } from "sonner";
import { apiRequest, createMutationHook } from "../apiSlice/apiSlice";
import { TEmployee, TEmployeeState } from "../employeeApiSlice/employeeType";

export const useUserVerifyMutation = createMutationHook<
  TEmployeeState<TEmployee>,
  string
>(
  (email) =>
    apiRequest<TEmployeeState<TEmployee>>({
      url: `/authentication/verify-user`,
      method: "POST",
      body: { email },
    }),
  {
    onError: (error) => {
      const errorMessage =
        (error as ErrorResponse)?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
  },
);

export const useVerifyOTPMutation = createMutationHook<
  TEmployeeState<TEmployee>,
  { email: string; otp: string }
>(({ email, otp }) =>
  apiRequest<TEmployeeState<TEmployee>>({
    url: `/authentication/verify-otp`,
    method: "POST",
    body: { email, otp },
  }),
);

export const useResetPasswordMutation = createMutationHook<
  { message: string },
  { email: string; password: string; reset_token: string }
>(({ email, password, reset_token }) =>
  apiRequest<{ message: string }>({
    url: `/authentication/recovery-password`,
    method: "PATCH",
    body: { email, password, reset_token },
  }),
);

export const useResendOTPMutation = createMutationHook<
  { message: string },
  { email: string }
>(({ email }) =>
  apiRequest<{ message: string }>({
    url: `/authentication/resend-otp`,
    method: "POST",
    body: { email },
  }),
);
