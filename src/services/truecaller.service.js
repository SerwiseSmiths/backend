"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTruecallerResponse = void 0;
const axios_1 = require("axios");
const crypto = require("crypto");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const TRUECALLER_KEY_URL = "https://api4.truecaller.com/v1/key";
const TRUECALLER_KEYS_TTL_MS = 60 * 60 * 1000; // 1 hour
let cachedKeys = [];
let cachedAt = 0;
async function getTruecallerPublicKeys() {
    if (cachedKeys.length && Date.now() - cachedAt < TRUECALLER_KEYS_TTL_MS) {
        return cachedKeys;
    }
    try {
        const res = await axios_1.default.get(TRUECALLER_KEY_URL, {
            timeout: 5000,
        });
        const keys = res.data?.keys ?? [];
        if (!Array.isArray(keys) || keys.length === 0) {
            throw new Error("No Truecaller public keys in response");
        }
        cachedKeys = keys;
        cachedAt = Date.now();
        return cachedKeys;
    }
    catch (err) {
        console.error("Failed to fetch Truecaller public keys:", err);
        throw new ApiError_api_util_1.default(502, "Unable to verify Truecaller response");
    }
}
/**
 * Verify Truecaller SDK response using Truecaller's public keys.
 * Expects base64-encoded payload and signature, and validates:
 * - Signature over payload using Truecaller public keys
 * - requestNonce from payload matches caller-provided requestNonce
 */
const verifyTruecallerResponse = async (params) => {
    const { payload, signature, requestNonce } = params;
    if (!payload || !signature || !requestNonce) {
        throw new ApiError_api_util_1.default(400, "Missing Truecaller verification data");
    }
    const payloadBuffer = Buffer.from(payload, "base64");
    const signatureBuffer = Buffer.from(signature, "base64");
    const keys = await getTruecallerPublicKeys();
    let isValid = false;
    for (const pem of keys) {
        try {
            const verifier = crypto.createVerify("RSA-SHA256");
            verifier.update(payloadBuffer);
            verifier.end();
            if (verifier.verify(pem, signatureBuffer)) {
                isValid = true;
                break;
            }
        }
        catch (err) {
            // Ignore individual key errors and try next key
            console.warn("Truecaller key verification failed, trying next key");
        }
    }
    if (!isValid) {
        throw new ApiError_api_util_1.default(401, "Invalid Truecaller signature");
    }
    let parsed;
    try {
        parsed = JSON.parse(payloadBuffer.toString("utf8"));
    }
    catch (err) {
        console.error("Failed to parse Truecaller payload JSON:", err);
        throw new ApiError_api_util_1.default(400, "Invalid Truecaller payload");
    }
    if (parsed.requestNonce && parsed.requestNonce !== requestNonce) {
        throw new ApiError_api_util_1.default(400, "Truecaller nonce mismatch");
    }
    return {
        ...parsed,
        rawJson: parsed,
    };
};
exports.verifyTruecallerResponse = verifyTruecallerResponse;
//# sourceMappingURL=truecaller.service.js.map