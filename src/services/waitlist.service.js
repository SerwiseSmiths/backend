"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWaitlist = exports.joinWaitlist = void 0;
const WaitlistRepo = require("../repositories/waitlist.repo");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const telegram_service_1 = require("./telegram.service");
// ─────────────────────────────────────────────────────────────────────────────
// Join Waitlist
// ─────────────────────────────────────────────────────────────────────────────
const joinWaitlist = async (phoneNo, countryCode = "+91", source = "website") => {
    if (!phoneNo || typeof phoneNo !== "string" || phoneNo.trim() === "") {
        throw new ApiError_api_util_1.default(400, "A valid phone number is required");
    }
    const normalized = phoneNo.trim().replace(/\s+/g, "");
    const existing = await WaitlistRepo.findByPhoneNo(normalized);
    if (existing) {
        return new ApiSuccess_api_util_1.default(200, "You're already on the waitlist!", {
            alreadyJoined: true,
            joinedAt: existing.joinedAt,
        });
    }
    const entry = await WaitlistRepo.create({ phoneNo: normalized, countryCode, source });
    // Fire-and-forget Telegram notification
    (0, telegram_service_1.notifyWaitlistJoin)({ phoneNo: normalized, countryCode, source, joinedAt: entry.joinedAt });
    return new ApiSuccess_api_util_1.default(201, "You've joined the waitlist! We'll reach out soon.", {
        alreadyJoined: false,
        joinedAt: entry.joinedAt,
    });
};
exports.joinWaitlist = joinWaitlist;
// ─────────────────────────────────────────────────────────────────────────────
// Get Waitlist (admin use)
// ─────────────────────────────────────────────────────────────────────────────
const getWaitlist = async () => {
    const [entries, total] = await Promise.all([WaitlistRepo.getAll(), WaitlistRepo.count()]);
    return new ApiSuccess_api_util_1.default(200, "Waitlist fetched", { total, entries });
};
exports.getWaitlist = getWaitlist;
//# sourceMappingURL=waitlist.service.js.map