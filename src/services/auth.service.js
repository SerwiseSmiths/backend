"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truecallerOAuthAuth = exports.truecallerAuth = exports.logout = exports.verifyOtp = exports.generateOtp = exports.login = void 0;
const User_schema_1 = require("../models/schema/User.schema");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const UserRepo = require("../repositories/user.repo");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const OtpRepo = require("../repositories/otp.repo");
const bcrypt = require("bcryptjs");
const axios_1 = require("axios");
const msg91WhatsApp_service_1 = require("./msg91WhatsApp.service");
const truecaller_service_1 = require("./truecaller.service");
const telegram_service_1 = require("./telegram.service");
const wallet_services_1 = require("./wallet.services");
const wallet_type_1 = require("../types/wallet.type");
const strapi_service_1 = require("./strapi.service");
async function creditSignupBonus(userId) {
    try {
        console.log("[SignupBonus] Fetching bonus config from Strapi...");
        const bonusConfig = await (0, strapi_service_1.fetchSignupBonusConfig)();
        console.log("[SignupBonus] Config received:", JSON.stringify(bonusConfig));
        if (!bonusConfig) {
            console.warn("[SignupBonus] No config returned from Strapi — skipping");
        }
        else if (!bonusConfig.enabled) {
            console.warn("[SignupBonus] Bonus is disabled in Strapi — skipping");
        }
        else if (bonusConfig.bonusAmount <= 0) {
            console.warn("[SignupBonus] bonusAmount is 0 or negative — skipping");
        }
        else {
            console.log(`[SignupBonus] Crediting ₹${bonusConfig.bonusAmount} to user ${userId}`);
            await (0, wallet_services_1.creditWallet)(userId, bonusConfig.bonusAmount, wallet_type_1.WalletLedgerSource.CASHBACK, undefined, { description: `Welcome bonus — ₹${bonusConfig.bonusAmount}` });
            console.log(`[SignupBonus] ✅ ₹${bonusConfig.bonusAmount} credited successfully to ${userId}`);
        }
    }
    catch (err) {
        console.error("[SignupBonus] ❌ Failed to credit signup bonus:", err);
    }
}
const TRUECALLER_TOKEN_URL = "https://oauth-account-noneu.truecaller.com/v1/token";
const TRUECALLER_USERINFO_URL = "https://oauth-account-noneu.truecaller.com/v1/userinfo";
const OTP_TTL_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const TEST_PHONES = {
    "1234567890": "123456",
    "9112345678": "123456",
};
const OTP_MESSAGE_TEMPLATE = "Your OTP is {otp}. Valid for {minutes} minutes. Do not share.";
const generateOtpCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
const sendOtp = async (phoneNo, otp) => {
    const text = OTP_MESSAGE_TEMPLATE
        .replace("{otp}", otp)
        .replace("{minutes}", String(OTP_TTL_MINUTES));
    const result = await (0, msg91WhatsApp_service_1.sendWhatsAppText)({
        recipientNumber: phoneNo,
        text: otp,
    });
    if (!result.success) {
        console.error(`OTP send failed for ${phoneNo}:`, result.error);
        // In non-production, still log OTP for manual testing
        if (process.env.NODE_ENV !== "production") {
            console.log(`OTP for ${phoneNo}: ${otp}`);
        }
        // Do not continue with flow if OTP couldn't be sent
        throw new ApiError_api_util_1.default(502, "Failed to send OTP, please try again");
    }
};
const login = async (_phoneNo, _userType, appContext) => {
    if (!_phoneNo) {
        throw new ApiError_api_util_1.default(401, "Phone no required");
    }
    console.log(`Login attempt for: ${_phoneNo}, userType: ${_userType || "customer"}`);
    let user = await UserRepo.retriveUserByPhoneNo(_phoneNo);
    const isNewUser = !user;
    const normalizedAppContext = appContext?.toLowerCase();
    const isRadixContext = normalizedAppContext === "radix" || normalizedAppContext === "readix";
    if (!user) {
        if (isRadixContext) {
            throw new ApiError_api_util_1.default(403, "User creation not allowed from Radix");
        }
        console.log(`Creating new user: ${_phoneNo}`);
        user = await User_schema_1.default.create({
            phoneNo: _phoneNo,
            userType: _userType || "customer",
            firstName: "User",
            lastName: _phoneNo.slice(-4),
        });
        console.log(`New user created with ID: ${user._id}`);
        (0, telegram_service_1.notifyNewUser)(user).catch(() => { });
        creditSignupBonus(user._id.toString()).catch(() => { });
    }
    else {
        console.log(`Existing user found: ${user._id}`);
        if (isRadixContext && user.userType !== "provider") {
            throw new ApiError_api_util_1.default(403, "Only providers can log in to Radix");
        }
    }
    const tokens = await user.generateAuthTokens();
    return new ApiSuccess_api_util_1.default(200, "User logged in successfully", {
        tokens,
        user,
        isNewUser,
    });
};
exports.login = login;
const generateOtp = async (_phoneNo) => {
    if (!_phoneNo) {
        throw new ApiError_api_util_1.default(400, "Phone no required");
    }
    const existingUser = await UserRepo.retriveUserByPhoneNo(_phoneNo);
    const userExists = !!existingUser;
    // Test number: skip real OTP generation and delivery
    if (_phoneNo in TEST_PHONES) {
        const testOtp = TEST_PHONES[_phoneNo];
        console.log(`[TEST] OTP for ${_phoneNo}: ${testOtp}`);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(testOtp, salt);
        const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
        await OtpRepo.upsertOtp(_phoneNo, hash, expiresAt);
        return new ApiSuccess_api_util_1.default(200, "OTP generated successfully", {
            ttlMinutes: OTP_TTL_MINUTES,
            userExists,
        });
    }
    const otp = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(otp, salt);
    await OtpRepo.upsertOtp(_phoneNo, hash, expiresAt);
    await sendOtp(_phoneNo, otp);
    return new ApiSuccess_api_util_1.default(200, "OTP generated successfully", {
        ttlMinutes: OTP_TTL_MINUTES,
        userExists,
    });
};
exports.generateOtp = generateOtp;
const verifyOtp = async (_phoneNo, otp, _userType, flow, appContext) => {
    if (!_phoneNo || !otp) {
        throw new ApiError_api_util_1.default(400, "Phone no and otp required");
    }
    const record = await OtpRepo.findLatestActiveOtp(_phoneNo);
    if (!record) {
        throw new ApiError_api_util_1.default(400, "Invalid or expired OTP");
    }
    if (record.expiresAt.getTime() < Date.now()) {
        await OtpRepo.consumeOtp(record.id);
        throw new ApiError_api_util_1.default(400, "Invalid or expired OTP");
    }
    if (record.attempts >= OTP_MAX_ATTEMPTS) {
        throw new ApiError_api_util_1.default(400, "Maximum OTP attempts exceeded");
    }
    const isMatch = (_phoneNo in TEST_PHONES && otp === TEST_PHONES[_phoneNo]) ||
        (await bcrypt.compare(otp, record.otp));
    if (!isMatch) {
        await OtpRepo.incrementAttempts(record.id);
        throw new ApiError_api_util_1.default(400, "Invalid OTP");
    }
    await OtpRepo.consumeOtp(record.id);
    const effectiveFlow = flow || "login";
    if (effectiveFlow === "signup") {
        const payload = {
            phoneNo: _phoneNo,
            flow: "signup",
        };
        const ACCESS_SECRET = process.env.JWT_SECRET;
        const jwt = require("jsonwebtoken");
        const verificationSignature = jwt.sign(payload, ACCESS_SECRET, {
            expiresIn: "15m",
        });
        return new ApiSuccess_api_util_1.default(200, "Phone verified for signup", {
            phoneNo: _phoneNo,
            verificationSignature,
        });
    }
    const loginResult = await (0, exports.login)(_phoneNo, _userType, appContext);
    return loginResult;
};
exports.verifyOtp = verifyOtp;
const logout = async () => { };
exports.logout = logout;
const truecallerAuth = async (params) => {
    const { payload, signature, requestNonce, userType } = params;
    if (!payload || !signature || !requestNonce) {
        throw new ApiError_api_util_1.default(400, "payload, signature and requestNonce are required");
    }
    const profile = await (0, truecaller_service_1.verifyTruecallerResponse)({ payload, signature, requestNonce });
    const rawPhone = (profile.phoneNumber ?? "").replace(/\D/g, "");
    if (!rawPhone) {
        throw new ApiError_api_util_1.default(400, "Phone number missing in Truecaller profile");
    }
    const normalizedPhone = normalizeDbPhone(rawPhone);
    console.log(`Truecaller auth for phone: ${normalizedPhone}, name: ${profile.firstName || ""} ${profile.lastName || ""}`);
    let user = await UserRepo.retriveUserByPhoneNo(normalizedPhone);
    const isNewUser = !user;
    if (!user) {
        user = await User_schema_1.default.create({
            phoneNo: normalizedPhone,
            userType: userType || "customer",
            firstName: profile.firstName || "User",
            lastName: profile.lastName || normalizedPhone.slice(-4),
        });
        (0, telegram_service_1.notifyNewUser)(user).catch(() => { });
        creditSignupBonus(user._id.toString()).catch(() => { });
    }
    const tokens = await user.generateAuthTokens();
    return new ApiSuccess_api_util_1.default(200, "User logged in via Truecaller", {
        tokens,
        user,
        isNewUser,
        authMethod: "truecaller",
    });
};
exports.truecallerAuth = truecallerAuth;
/**
 * Truecaller OAuth 3.2.1 flow: exchange authorization code for token, fetch profile, login.
 */
const truecallerOAuthAuth = async (params) => {
    const { authorizationCode, codeVerifier, userType } = params;
    const clientId = process.env.TRUECALLER_CLIENT_ID;
    if (!authorizationCode || !codeVerifier) {
        throw new ApiError_api_util_1.default(400, "authorizationCode and codeVerifier are required");
    }
    if (!clientId) {
        throw new ApiError_api_util_1.default(500, "Truecaller client ID not configured");
    }
    const tokenRes = await axios_1.default.post(TRUECALLER_TOKEN_URL, new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        code: authorizationCode,
        code_verifier: codeVerifier,
    }).toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10000,
    });
    const accessToken = tokenRes.data?.access_token;
    if (!accessToken) {
        throw new ApiError_api_util_1.default(401, "Failed to get Truecaller access token");
    }
    const profileRes = await axios_1.default.get(TRUECALLER_USERINFO_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 10000,
    });
    const profile = profileRes.data;
    const rawPhone = (profile?.phone_number ?? "").replace(/\D/g, "");
    if (!rawPhone) {
        throw new ApiError_api_util_1.default(400, "Phone number missing in Truecaller profile");
    }
    const normalizedPhone = normalizeDbPhone(rawPhone);
    const firstName = profile?.given_name || "User";
    const lastName = profile?.family_name || normalizedPhone.slice(-4);
    console.log(`Truecaller OAuth auth for phone: ${normalizedPhone}, name: ${firstName} ${lastName}`);
    let user = await UserRepo.retriveUserByPhoneNo(normalizedPhone);
    const isNewUser = !user;
    if (!user) {
        user = await User_schema_1.default.create({
            phoneNo: normalizedPhone,
            userType: userType || "customer",
            firstName,
            lastName,
            profileImage: profile?.picture ?? undefined,
        });
        (0, telegram_service_1.notifyNewUser)(user).catch(() => { });
        creditSignupBonus(user._id.toString()).catch(() => { });
    }
    const tokens = await user.generateAuthTokens();
    return new ApiSuccess_api_util_1.default(200, "User logged in via Truecaller", {
        tokens,
        user,
        isNewUser,
        authMethod: "truecaller",
    });
};
exports.truecallerOAuthAuth = truecallerOAuthAuth;
function normalizeDbPhone(phone) {
    // Store 10-digit local number for consistency with existing users
    if (phone.length > 10 && phone.startsWith("91")) {
        return phone.slice(-10);
    }
    return phone;
}
//# sourceMappingURL=auth.service.js.map