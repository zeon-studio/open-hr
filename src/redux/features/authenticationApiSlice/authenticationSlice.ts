import { ErrorResponse } from "@/types";
import { toast } from "sonner";
import { apiSlice } from "../apiSlice/apiSlice";
import { TEmployee, TEmployeeState } from "../employeeApiSlice/employeeType";

export const authenticationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userVerify: builder.mutation<TEmployeeState<TEmployee>, string>({
      query: (email) => ({
        url: `/authentication/verify-user`,
        method: "POST",
        body: { email, currentTime: Date.now() },
      }),

      async onQueryStarted(email, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          const errorMessage =
            (error as ErrorResponse).data.message || "Something went wrong";
          toast.error(errorMessage);
        }
      },
    }),

    verifyOTP: builder.mutation<
      TEmployeeState<TEmployee>,
      { email: string; otp: string }
    >({
      query: ({ email, otp }) => ({
        url: `/authentication/verify-otp`,
        method: "POST",
        body: { email, otp, currentTime: Date.now() },
      }),
    }),

    resetPassword: builder.mutation<
      {
        message: string;
      },
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: `/authentication/recovery-password`,
        method: "PATCH",
        body: { email, password, currentTime: Date.now() },
      }),
    }),

    resendOTP: builder.mutation<{ message: string }, { email: string }>({
      query: ({ email }) => ({
        url: `/authentication/resend-otp`,
        method: "POST",
        body: { email, currentTime: Date.now() },
      }),
    }),
  }),
});

export const {
  useUserVerifyMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useResendOTPMutation,
} = authenticationApi;
