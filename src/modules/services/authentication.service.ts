import variables from "@/config/variables";
import { Authentication } from "@/models/authentication.model";
import { Employee } from "@/models/employee.model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import nodemailer from "nodemailer";

const sendOtpEmail = async (to: string, otp: string) => {
  if (!variables.sender_email || !variables.sender_password) {
    return;
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: variables.sender_email,
      pass: variables.sender_password,
    },
  });

  await transport.sendMail({
    from: variables.sender_email,
    to,
    subject: "Password reset OTP",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });
};

const createInviteToken = (id: string, role = "user") => {
  const options: SignOptions = {
    expiresIn: variables.jwt_expire as SignOptions["expiresIn"],
  };
  return jwt.sign({ id, role }, variables.jwt_secret, options);
};

export const verifyInviteToken = (token: string) => {
  return jwt.verify(token, variables.jwt_secret) as JwtPayload;
};

export const verifyUserService = async (email: string) => {
  const user = await Employee.findOne({ work_email: email });
  if (!user?.id) {
    throw new Error("User not found");
  }

  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const hashedOtp = await bcrypt.hash(otp, variables.salt);
  const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  await Authentication.findOneAndUpdate(
    { user_id: user.id },
    {
      $set: {
        pass_reset_token: {
          token: hashedOtp,
          expires,
        },
      },
    },
    { upsert: true, new: true },
  );

  await sendOtpEmail(email, otp);
  return user;
};

export const verifyOtpService = async (email: string, otp: string) => {
  const user = await Employee.findOne({ work_email: email });
  if (!user?.id) {
    throw new Error("User not found");
  }

  const authDoc = await Authentication.findOne({ user_id: user.id });
  const token = authDoc?.pass_reset_token?.token;
  const expires = authDoc?.pass_reset_token?.expires;

  if (!token || !expires) {
    throw new Error("OTP not found or expired");
  }

  if (new Date(expires) <= new Date()) {
    throw new Error("OTP expired");
  }

  const match = await bcrypt.compare(otp, token);
  if (!match) {
    throw new Error("Incorrect OTP");
  }

  await Employee.updateOne({ id: user.id }, { $set: { verified: true } });
  return true;
};

export const resetPasswordService = async (
  email: string,
  password: string,
  reset_token: string,
) => {
  const user = await Employee.findOne({ work_email: email });
  if (!user?.id) {
    throw new Error("User not found");
  }

  const authDoc = await Authentication.findOne({ user_id: user.id });
  const token = authDoc?.pass_reset_token?.token;
  const expires = authDoc?.pass_reset_token?.expires;

  if (!token || !expires || new Date(expires) <= new Date()) {
    throw new Error("OTP expired");
  }

  const match = await bcrypt.compare(reset_token, token);
  if (!match) {
    throw new Error("Incorrect OTP");
  }

  const hashedPassword = await bcrypt.hash(password, variables.salt);
  const updated = await Employee.findOneAndUpdate(
    { id: user.id },
    { $set: { password: hashedPassword } },
    { new: true },
  );

  await Authentication.updateOne(
    { user_id: user.id },
    { $unset: { pass_reset_token: "" } },
  );

  return updated;
};

export const updatePasswordService = async (
  id: string,
  current_password: string,
  new_password: string,
) => {
  const user = await Employee.findOne({ id }).select("+password");
  if (!user) {
    throw new Error("User not found");
  }

  if (user.password) {
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }
  }

  const hashedPassword = await bcrypt.hash(new_password, variables.salt);
  await Employee.updateOne({ id }, { $set: { password: hashedPassword } });
  return true;
};

export const issueInviteTokenService = async (email: string) => {
  const user = await Employee.findOne({ work_email: email });
  if (!user?.id) {
    throw new Error("User not found");
  }

  return createInviteToken(user.id, user.role || "user");
};
