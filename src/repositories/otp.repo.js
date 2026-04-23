"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementAttempts = exports.consumeOtp = exports.findLatestActiveOtp = exports.upsertOtp = void 0;
const Otp_schema_1 = require("../models/schema/Otp.schema");
const upsertOtp = async (phoneNo, hash, expiresAt) => {
    const record = await Otp_schema_1.default.findOneAndUpdate({ phoneNo }, {
        phoneNo,
        otp: hash,
        expiresAt,
        consumed: false,
        attempts: 0,
    }, { upsert: true, new: true });
    return record;
};
exports.upsertOtp = upsertOtp;
const findLatestActiveOtp = async (phoneNo) => {
    const record = await Otp_schema_1.default.findOne({ phoneNo, consumed: false }).sort({
        createdAt: -1,
    });
    return record;
};
exports.findLatestActiveOtp = findLatestActiveOtp;
const consumeOtp = async (id) => {
    await Otp_schema_1.default.findByIdAndUpdate(id, { consumed: true });
};
exports.consumeOtp = consumeOtp;
const incrementAttempts = async (id) => {
    await Otp_schema_1.default.findByIdAndUpdate(id, { $inc: { attempts: 1 } });
};
exports.incrementAttempts = incrementAttempts;
//# sourceMappingURL=otp.repo.js.map