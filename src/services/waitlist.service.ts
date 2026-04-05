import * as WaitlistRepo from "../repositories/waitlist.repo";
import ApiError from "../utils/api/ApiError.api.util";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import { notifyWaitlistJoin } from "./telegram.service";

// ─────────────────────────────────────────────────────────────────────────────
// Join Waitlist
// ─────────────────────────────────────────────────────────────────────────────
export const joinWaitlist = async (
  phoneNo: string,
  countryCode: string = "+91",
  source: string = "website"
) => {
  if (!phoneNo || typeof phoneNo !== "string" || phoneNo.trim() === "") {
    throw new ApiError(400, "A valid phone number is required");
  }

  const normalized = phoneNo.trim().replace(/\s+/g, "");

  const existing = await WaitlistRepo.findByPhoneNo(normalized);
  if (existing) {
    return new ApiSuccess(200, "You're already on the waitlist!", {
      alreadyJoined: true,
      joinedAt: existing.joinedAt,
    });
  }

  const entry = await WaitlistRepo.create({ phoneNo: normalized, countryCode, source });

  // Fire-and-forget Telegram notification
  notifyWaitlistJoin({ phoneNo: normalized, countryCode, source, joinedAt: entry.joinedAt });

  return new ApiSuccess(201, "You've joined the waitlist! We'll reach out soon.", {
    alreadyJoined: false,
    joinedAt: entry.joinedAt,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Get Waitlist (admin use)
// ─────────────────────────────────────────────────────────────────────────────
export const getWaitlist = async () => {
  const [entries, total] = await Promise.all([WaitlistRepo.getAll(), WaitlistRepo.count()]);
  return new ApiSuccess(200, "Waitlist fetched", { total, entries });
};
