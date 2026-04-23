"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMapplsToken = void 0;
const axios_1 = require("axios");
let cachedToken = null;
let tokenExpiry = 0;
const getMapplsToken = async () => {
    const now = Date.now();
    // If token is cached & not expired, return
    if (cachedToken && now < tokenExpiry) {
        return cachedToken;
    }
    const clientId = process.env.MAPPLS_CLIENT_ID;
    const clientSecret = process.env.MAPPLS_CLIENT_SECRET;
    const url = `https://outpost.mapmyindia.com/api/security/oauth/token`;
    const response = await axios_1.default.post(url, `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    cachedToken = response.data.access_token;
    tokenExpiry = now + response.data.expires_in * 1000;
    return cachedToken;
};
exports.getMapplsToken = getMapplsToken;
//# sourceMappingURL=mappleToken.service.js.map