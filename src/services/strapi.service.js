"use strict";
// Strapi CMS Service
// Fetches device types and other content from Strapi CMS
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveDeviceTypes = exports.clearDeviceTypeCache = exports.validateDeviceTypeId = exports.fetchDeviceTypeById = exports.fetchDeviceTypes = void 0;
const strapi_config_1 = require("../config/strapi.config");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
// In-memory cache for device types
let deviceTypeCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
/**
 * Fetch all device types from Strapi CMS
 */
const fetchDeviceTypes = async () => {
    // Return cached data if still valid
    if (deviceTypeCache && Date.now() - cacheTimestamp < CACHE_TTL) {
        return deviceTypeCache;
    }
    try {
        const response = await fetch((0, strapi_config_1.getStrapiUrl)("/device-types"), {
            method: "GET",
            headers: (0, strapi_config_1.getStrapiHeaders)(),
        });
        if (!response.ok) {
            console.warn(`Strapi API returned ${response.status}: ${response.statusText}`);
            // Return cached data if available, even if stale
            if (deviceTypeCache) {
                return deviceTypeCache;
            }
            throw new ApiError_api_util_1.default(502, "Failed to fetch device types from CMS");
        }
        const data = await response.json();
        deviceTypeCache = data.data;
        cacheTimestamp = Date.now();
        return deviceTypeCache;
    }
    catch (error) {
        console.error("Error fetching device types from Strapi:", error);
        // Return cached data if available
        if (deviceTypeCache) {
            return deviceTypeCache;
        }
        throw new ApiError_api_util_1.default(502, "CMS service unavailable");
    }
};
exports.fetchDeviceTypes = fetchDeviceTypes;
/**
 * Fetch a single device type by Strapi ID
 */
const fetchDeviceTypeById = async (strapiId) => {
    // Check cache first
    if (deviceTypeCache && Date.now() - cacheTimestamp < CACHE_TTL) {
        const cached = deviceTypeCache.find((dt) => dt.id === Number(strapiId));
        if (cached)
            return cached;
    }
    try {
        const response = await fetch((0, strapi_config_1.getStrapiUrl)(`/device-types/${strapiId}`), {
            method: "GET",
            headers: (0, strapi_config_1.getStrapiHeaders)(),
        });
        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new ApiError_api_util_1.default(502, "Failed to fetch device type from CMS");
        }
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error("Error fetching device type from Strapi:", error);
        throw new ApiError_api_util_1.default(502, "CMS service unavailable");
    }
};
exports.fetchDeviceTypeById = fetchDeviceTypeById;
/**
 * Validate that a Strapi device type ID exists
 */
const validateDeviceTypeId = async (strapiId) => {
    const deviceType = await (0, exports.fetchDeviceTypeById)(strapiId);
    return deviceType !== null && deviceType.status === "active";
};
exports.validateDeviceTypeId = validateDeviceTypeId;
/**
 * Clear the device type cache (useful for testing or manual refresh)
 */
const clearDeviceTypeCache = () => {
    deviceTypeCache = null;
    cacheTimestamp = 0;
};
exports.clearDeviceTypeCache = clearDeviceTypeCache;
/**
 * Get active device types only
 */
const getActiveDeviceTypes = async () => {
    const allTypes = await (0, exports.fetchDeviceTypes)();
    return allTypes.filter((dt) => dt.status === "active");
};
exports.getActiveDeviceTypes = getActiveDeviceTypes;
exports.default = {
    fetchDeviceTypes: exports.fetchDeviceTypes,
    fetchDeviceTypeById: exports.fetchDeviceTypeById,
    validateDeviceTypeId: exports.validateDeviceTypeId,
    clearDeviceTypeCache: exports.clearDeviceTypeCache,
    getActiveDeviceTypes: exports.getActiveDeviceTypes,
};
//# sourceMappingURL=strapi.service.js.map