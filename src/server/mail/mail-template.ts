import { dateFormat } from "@/lib/date-converter";

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

export function leaveRequestTemplate(
  appUrl: string,
  appName: string,
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: Date,
  endDate: Date,
  reason: string,
): string {
  return `<div style="font-family:Arial,sans-serif;color:#333;">
    <p>${name} has submitted a request for leave. Below are the details:</p>
    <ul style="list-style-type:none;padding:0;">
      <li style="text-transform:capitalize;margin-bottom:5px;"><strong>Type of Leave:</strong> ${leaveType}</li>
      <li style="margin-bottom:5px;"><strong>Number of ${dayCount === 1 ? "Day" : "Days"}:</strong> ${dayCount === 1 ? `${dayCount} day on ${dateFormat(startDate)}` : `${dayCount} days from ${dateFormat(startDate)} to ${dateFormat(endDate)}`}</li>
      <li style="margin-bottom:5px;"><strong>Reason:</strong> ${reason}</li>
    </ul>
    <p>To accept or reject the request visit <a href="${appUrl}/leave-requests" style="color:#007bff;">${appName}</a></p>
  </div>`;
}

export function leaveRequestApprovedTemplate(
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: Date,
  endDate: Date,
  reason: string,
): string {
  return `<div style="font-family:Arial,sans-serif;color:#333;">
    <p>Dear ${name},</p>
    <p>Your request for leave has been reviewed and approved. Below are the details:</p>
    <ul style="list-style-type:none;padding:0;">
      <li style="margin-bottom:5px;"><strong>Type of Leave:</strong> ${leaveType}</li>
      <li style="margin-bottom:5px;"><strong>Number of ${dayCount === 1 ? "Day" : "Days"}:</strong> ${dayCount === 1 ? `${dayCount} day on ${dateFormat(startDate)}` : `${dayCount} days from ${dateFormat(startDate)} to ${dateFormat(endDate)}`}</li>
      <li style="margin-bottom:5px;"><strong>Reason:</strong> ${reason}</li>
    </ul>
    <p>Please ensure all necessary handovers are made before your leave begins.</p>
    <p>Best Regards,<br>Admin Team</p>
  </div>`;
}

export function leaveRequestRejectedTemplate(
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: Date,
  endDate: Date,
  reason: string,
): string {
  return `<div style="font-family:Arial,sans-serif;color:#333;">
    <p>Dear ${name},</p>
    <p>We regret to inform you that your leave request has been rejected. Below are the details:</p>
    <ul style="list-style-type:none;padding:0;">
      <li style="margin-bottom:5px;"><strong>Type of Leave:</strong> ${leaveType}</li>
      <li style="margin-bottom:5px;"><strong>Number of ${dayCount === 1 ? "Day" : "Days"}:</strong> ${dayCount === 1 ? `${dayCount} day on ${dateFormat(startDate)}` : `${dayCount} days from ${dateFormat(startDate)} to ${dateFormat(endDate)}`}</li>
      <li style="margin-bottom:5px;"><strong>Reason:</strong> ${reason}</li>
    </ul>
    <p>Please contact your manager for more information.</p>
    <p>Best Regards,<br>Admin Team</p>
  </div>`;
}

export function leaveRequestDiscordTemplate(
  name: string,
  leaveType: string,
  dayCount: number,
  startDate: Date,
  endDate: Date,
  reason: string,
): string {
  return `**${name}** has requested **${leaveType}** leave for **${dayCount}** ${dayCount === 1 ? `**day** on **${dateFormat(startDate)}**` : `**days** from **${dateFormat(startDate)}** to **${dateFormat(endDate)}**`} with reason: **${reason}**`;
}
