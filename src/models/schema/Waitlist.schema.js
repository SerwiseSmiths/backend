"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WaitlistSchema = new mongoose_1.Schema({
    phoneNo: { type: String, required: true, unique: true, trim: true },
    countryCode: { type: String, required: true, default: "+91" },
    joinedAt: { type: Date, default: Date.now },
    notifiedViaTruecaller: { type: Boolean, default: false },
    truecallerNotifiedAt: { type: Date },
    source: { type: String, default: "website" },
}, { timestamps: true });
const WaitlistModel = mongoose_1.default.model("Waitlist", WaitlistSchema);
exports.default = WaitlistModel;
//# sourceMappingURL=Waitlist.schema.js.map