"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = void 0;
const crypto = require("crypto");
const verifySignature = (signature, payload) => {
    const secret = process.env.CASHFREE_WEBHOOK_SECRET;
    const computed = crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(payload))
        .digest("base64");
    return computed === signature;
};
exports.verifySignature = verifySignature;
//# sourceMappingURL=verifySignature.util.js.map