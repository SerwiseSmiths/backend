"use strict";
// Strapi CMS Configuration
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStrapiUrl = exports.getStrapiHeaders = void 0;
const strapiConfig = {
    apiUrl: process.env.STRAPI_API_URL || "http://localhost:1337",
    apiToken: process.env.STRAPI_API_TOKEN || "",
};
const getStrapiHeaders = () => ({
    "Content-Type": "application/json",
    ...(strapiConfig.apiToken && {
        Authorization: `Bearer ${strapiConfig.apiToken}`,
    }),
});
exports.getStrapiHeaders = getStrapiHeaders;
const getStrapiUrl = (endpoint) => {
    const baseUrl = strapiConfig.apiUrl.replace(/\/$/, "");
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${baseUrl}${path}`;
};
exports.getStrapiUrl = getStrapiUrl;
exports.default = strapiConfig;
//# sourceMappingURL=strapi.config.js.map