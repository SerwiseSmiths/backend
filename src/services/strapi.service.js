"use strict";
// Strapi CMS Service
// Fetches device types and other content from Strapi CMS
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSignupBonusConfig = exports.fetchFromStrapi = exports.getActiveDeviceTypes = exports.clearDeviceTypeCache = exports.validateDeviceTypeId = exports.fetchDeviceTypeById = exports.fetchDeviceTypes = void 0;
const strapi_config_1 = require("../config/strapi.config");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const serverQueryClient_1 = require("../utils/serverQueryClient");
const DEVICE_TYPES_QUERY_KEY = ["strapi", "device-types"];
/**
 * Fetch all device types from Strapi CMS
 */
const fetchDeviceTypes = async () => {
    return serverQueryClient_1.serverQueryClient.fetchQuery({
        queryKey: DEVICE_TYPES_QUERY_KEY,
        queryFn: async () => {
            try {
                const query = `
          query {
            deviceTypes(pagination: { limit: 100 }) {
              documentId
              type
              state
            }
          }
        `;
                const response = await fetch((0, strapi_config_1.getStrapiUrl)("/graphql"), {
                    method: "POST",
                    headers: { ...(0, strapi_config_1.getStrapiHeaders)(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query }),
                });
                if (!response.ok) {
                    console.warn(`Strapi API returned ${response.status}: ${response.statusText}`);
                    throw new ApiError_api_util_1.default(502, "Failed to fetch device types from CMS");
                }
                const data = await response.json();
                return data.data?.deviceTypes || [];
            }
            catch (error) {
                console.error("Error fetching device types from Strapi:", error);
                throw new ApiError_api_util_1.default(502, "CMS service unavailable");
            }
        },
    });
};
exports.fetchDeviceTypes = fetchDeviceTypes;
/**
 * Fetch a single device type by Strapi documentId
 */
const fetchDeviceTypeById = async (documentId) => {
    // Prefer the cached list when available
    try {
        const allTypes = await (0, exports.fetchDeviceTypes)();
        const fromList = allTypes.find((dt) => dt.documentId === documentId);
        if (fromList) {
            return fromList;
        }
    }
    catch {
        // Fall through to direct fetch if list query fails
    }
    try {
        const query = `
      query GetDeviceType($documentId: ID!) {
        deviceType(documentId: $documentId) {
          documentId
          type
          state
        }
      }
    `;
        const response = await fetch((0, strapi_config_1.getStrapiUrl)(`/graphql`), {
            method: "POST",
            headers: { ...(0, strapi_config_1.getStrapiHeaders)(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { documentId } }),
        });
        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new ApiError_api_util_1.default(502, "Failed to fetch device type from CMS");
        }
        const data = await response.json();
        return data.data?.deviceType || null;
    }
    catch (error) {
        console.error("Error fetching device type from Strapi:", error);
        throw new ApiError_api_util_1.default(502, "CMS service unavailable");
    }
};
exports.fetchDeviceTypeById = fetchDeviceTypeById;
/**
 * Validate that a Strapi device type documentId exists
 */
const validateDeviceTypeId = async (documentId) => {
    const deviceType = await (0, exports.fetchDeviceTypeById)(documentId);
    return deviceType !== null && (deviceType.state === "active" || deviceType.state === "ACTIVE");
};
exports.validateDeviceTypeId = validateDeviceTypeId;
/**
 * Clear the device type cache (useful for testing or manual refresh)
 */
const clearDeviceTypeCache = () => {
    serverQueryClient_1.serverQueryClient.removeQueries({ queryKey: DEVICE_TYPES_QUERY_KEY });
};
exports.clearDeviceTypeCache = clearDeviceTypeCache;
/**
 * Get active device types only
 */
const getActiveDeviceTypes = async () => {
    const allTypes = await (0, exports.fetchDeviceTypes)();
    return allTypes.filter((dt) => dt.state === "active");
};
exports.getActiveDeviceTypes = getActiveDeviceTypes;
/**
 * Generic fetch from Strapi REST API
 */
const fetchFromStrapi = async (path) => {
    try {
        const url = (0, strapi_config_1.getStrapiUrl)(`/api${path}`);
        const response = await fetch(url, {
            headers: (0, strapi_config_1.getStrapiHeaders)(),
        });
        if (!response.ok) {
            console.warn(`Strapi REST API returned ${response.status}: ${response.statusText}`);
            return null;
        }
        return await response.json();
    }
    catch (error) {
        console.error(`Error fetching from Strapi (${path}):`, error);
        return null;
    }
};
exports.fetchFromStrapi = fetchFromStrapi;
/**
 * Fetch signup bonus configuration from Strapi single type
 */
const fetchSignupBonusConfig = async () => {
    const data = await (0, exports.fetchFromStrapi)("/sign-up-bonus");
    console.log("[SignupBonus] Raw Strapi REST response:", JSON.stringify(data));
    if (!data?.data) {
        console.warn("[SignupBonus] Strapi returned no data — check that sign-up-bonus single type is published and accessible");
        return null;
    }
    return {
        enabled: data.data.enabled ?? false,
        bonusAmount: data.data.bonusAmount ?? 0,
    };
};
exports.fetchSignupBonusConfig = fetchSignupBonusConfig;
exports.default = {
    fetchDeviceTypes: exports.fetchDeviceTypes,
    fetchDeviceTypeById: exports.fetchDeviceTypeById,
    validateDeviceTypeId: exports.validateDeviceTypeId,
    clearDeviceTypeCache: exports.clearDeviceTypeCache,
    getActiveDeviceTypes: exports.getActiveDeviceTypes,
    fetchFromStrapi: exports.fetchFromStrapi,
    fetchSignupBonusConfig: exports.fetchSignupBonusConfig,
};
//# sourceMappingURL=strapi.service.js.map