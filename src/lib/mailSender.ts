import variables from "@/config/variables";
import { invitationTemplate, otpSenderTemplate } from "@/lib/mailTemplate";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: variables.sender_email,
    pass: variables.sender_password,
  },
});

const sendMail = async (
  to: string | string[],
  subject: string,
  html: string,
) => {
  if (!variables.sender_email || !variables.sender_password) {
    return;
  }

  await transporter.sendMail({
    from: variables.sender_email,
    to,
    subject,
    html,
  });
};

const otpSender = async (email: string, otp: string) => {
  await sendMail(
    email,
    "Verification Code For HR Management System",
    otpSenderTemplate(otp),
  );
};

const invitationRequest = async (
  email: string,
  designation: string,
  invite_token: string,
  joining_date: Date,
) => {
  const appName = process.env.APP_NAME || "Open HR";
  const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || "";

  await sendMail(
    email,
    `Invitation to join ${appName}`,
    invitationTemplate(
      appName,
      appUrl,
      designation,
      joining_date,
      invite_token,
    ),
  );
};

export const mailSender = {
  otpSender,
  invitationRequest,
};
