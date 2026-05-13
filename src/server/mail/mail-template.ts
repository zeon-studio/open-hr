import { dateFormat } from "@/lib";

export function otpSenderTemplate(otp: string): string {
  return `<div style="text-align:center;font-family:Arial,sans-serif;color:#333;">
    <h1 style="color:#007bff;">OTP Verification</h1>
    <p>Use this OTP to verify your account</p>
    <div style="border:1px solid #ccc;padding:4px 20px;border-radius:5px;display:inline-block;">
      <h2>${otp}</h2>
    </div>
  </div>`;
}

export function invitationTemplate(
  appName: string,
  appUrl: string,
  designation: string,
  joining_date: Date,
  invite_token: string,
): string {
  return `<div style="text-align:center;font-family:Arial,sans-serif;color:#333;">
    <h1 style="color:#007bff;">Welcome to ${appName}!</h1>
    <p>We are excited to welcome you as a ${designation}.</p>
    <p>Your joining date is ${dateFormat(joining_date)}.</p>
    <a href="${appUrl}/onboard?token=${invite_token}" style="color:#007bff;">Click here</a> to join.
  </div>`;
}
