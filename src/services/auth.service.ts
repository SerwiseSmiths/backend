import UserModel from "../models/schema/User.schema";
import ApiError from "../utils/api/ApiError.api.util";
import * as UserRepo from "../repositories/user.repo";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import * as OtpRepo from "../repositories/otp.repo";
import * as bcrypt from "bcryptjs";
import { sendWhatsAppText } from "./msg91WhatsApp.service";
import { verifyTruecallerResponse } from "./truecaller.service";

const OTP_TTL_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;

const OTP_MESSAGE_TEMPLATE = "Your OTP is {otp}. Valid for {minutes} minutes. Do not share.";

const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (phoneNo: string, otp: string) => {
  const text = OTP_MESSAGE_TEMPLATE
    .replace("{otp}", otp)
    .replace("{minutes}", String(OTP_TTL_MINUTES));

  const result = await sendWhatsAppText({
    recipientNumber: phoneNo,
    text,
  });

  if (!result.success) {
    console.error(`OTP send failed for ${phoneNo}:`, result.error);
    // In development, still log OTP to console for testing without WhatsApp
    if (process.env.NODE_ENV !== "production") {
      console.log(`OTP for ${phoneNo}: ${otp}`);
    }
  }
};

export const login = async (_phoneNo: string, _userType?: string) => {
  if (!_phoneNo) {
    throw new ApiError(401, "Phone no required");
  }

  console.log(`Login attempt for: ${_phoneNo}, userType: ${_userType || "customer"}`);

  let user = await UserRepo.retriveUserByPhoneNo(_phoneNo);
  const isNewUser = !user;

  if (!user) {
    console.log(`Creating new user: ${_phoneNo}`);

    user = await UserModel.create({
      phoneNo: _phoneNo,
      userType: _userType || "customer",
      firstName: "User",
      lastName: _phoneNo.slice(-4),
    });

    console.log(`New user created with ID: ${user._id}`);
  } else {
    console.log(`Existing user found: ${user._id}`);
  }

  const tokens = await user.generateAuthTokens();

  return new ApiSuccess(200, "User logged in successfully", {
    tokens,
    user,
    isNewUser,
  });
};

export const generateOtp = async (_phoneNo: string) => {
  if (!_phoneNo) {
    throw new ApiError(400, "Phone no required");
  }

  const otp = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(otp, salt);

  await OtpRepo.upsertOtp(_phoneNo, hash, expiresAt);

  await sendOtp(_phoneNo, otp);

  return new ApiSuccess(200, "OTP generated successfully", {
    ttlMinutes: OTP_TTL_MINUTES,
  });
};

export const verifyOtp = async (_phoneNo: string, otp: string, _userType?: string, flow?: "login" | "signup") => {
  if (!_phoneNo || !otp) {
    throw new ApiError(400, "Phone no and otp required");
  }

  const record = await OtpRepo.findLatestActiveOtp(_phoneNo);

  if (!record) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await OtpRepo.consumeOtp(record.id);
    throw new ApiError(400, "Invalid or expired OTP");
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    throw new ApiError(400, "Maximum OTP attempts exceeded");
  }

  const isMatch = await bcrypt.compare(otp, record.otp);

  if (!isMatch) {
    await OtpRepo.incrementAttempts(record.id);
    throw new ApiError(400, "Invalid OTP");
  }

  await OtpRepo.consumeOtp(record.id);

  const effectiveFlow = flow || "login";

  if (effectiveFlow === "signup") {
    const payload = {
      phoneNo: _phoneNo,
      flow: "signup" as const,
    };

    const ACCESS_SECRET = process.env.JWT_SECRET!;
    const jwt = require("jsonwebtoken");

    const verificationSignature = jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: "15m",
    });

    return new ApiSuccess(200, "Phone verified for signup", {
      phoneNo: _phoneNo,
      verificationSignature,
    });
  }

  const loginResult = await login(_phoneNo, _userType);
  return loginResult;
};

export const logout = async () => {};

export const truecallerAuth = async (params: {
  payload: string;
  signature: string;
  requestNonce: string;
  userType?: string;
}) => {
  const { payload, signature, requestNonce, userType } = params;

  if (!payload || !signature || !requestNonce) {
    throw new ApiError(400, "payload, signature and requestNonce are required");
  }

  const profile = await verifyTruecallerResponse({ payload, signature, requestNonce });

  const rawPhone = (profile.phoneNumber ?? "").replace(/\D/g, "");
  if (!rawPhone) {
    throw new ApiError(400, "Phone number missing in Truecaller profile");
  }

  const normalizedPhone = normalizeDbPhone(rawPhone);

  console.log(
    `Truecaller auth for phone: ${normalizedPhone}, name: ${profile.firstName || ""} ${
      profile.lastName || ""
    }`
  );

  let user = await UserRepo.retriveUserByPhoneNo(normalizedPhone);
  const isNewUser = !user;

  if (!user) {
    user = await UserModel.create({
      phoneNo: normalizedPhone,
      userType: userType || "customer",
      firstName: profile.firstName || "User",
      lastName: profile.lastName || normalizedPhone.slice(-4),
    });
  }

  const tokens = await user.generateAuthTokens();

  return new ApiSuccess(200, "User logged in via Truecaller", {
    tokens,
    user,
    isNewUser,
    authMethod: "truecaller",
  });
};

function normalizeDbPhone(phone: string): string {
  // Store 10-digit local number for consistency with existing users
  if (phone.length > 10 && phone.startsWith("91")) {
    return phone.slice(-10);
  }
  return phone;
}
