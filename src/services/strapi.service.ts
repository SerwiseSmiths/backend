// Strapi CMS Service
// Fetches device types and other content from Strapi CMS

import { getStrapiHeaders, getStrapiUrl } from "../config/strapi.config";
import {
    IStrapiDeviceType,
    IStrapiResponse,
    IStrapiSingleResponse,
} from "../types/strapi.type";
import ApiError from "../utils/api/ApiError.api.util";

// In-memory cache for device types
let deviceTypeCache: IStrapiDeviceType[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all device types from Strapi CMS
 */
export const fetchDeviceTypes = async (): Promise<IStrapiDeviceType[]> => {
    // Return cached data if still valid
    if (deviceTypeCache && Date.now() - cacheTimestamp < CACHE_TTL) {
        return deviceTypeCache;
    }

    try {
        const response = await fetch(getStrapiUrl("/device-types"), {
            method: "GET",
            headers: getStrapiHeaders(),
        });

        if (!response.ok) {
            console.warn(
                `Strapi API returned ${response.status}: ${response.statusText}`
            );
            // Return cached data if available, even if stale
            if (deviceTypeCache) {
                return deviceTypeCache;
            }
            throw new ApiError(502, "Failed to fetch device types from CMS");
        }

        const data: IStrapiResponse<IStrapiDeviceType> = await response.json();
        deviceTypeCache = data.data;
        cacheTimestamp = Date.now();

        return deviceTypeCache;
    } catch (error) {
        console.error("Error fetching device types from Strapi:", error);
        // Return cached data if available
        if (deviceTypeCache) {
            return deviceTypeCache;
        }
        throw new ApiError(502, "CMS service unavailable");
    }
};

/**
 * Fetch a single device type by Strapi ID
 */
export const fetchDeviceTypeById = async (
    strapiId: number | string
): Promise<IStrapiDeviceType | null> => {
    // Check cache first
    if (deviceTypeCache && Date.now() - cacheTimestamp < CACHE_TTL) {
        const cached = deviceTypeCache.find(
            (dt) => dt.id === Number(strapiId)
        );
        if (cached) return cached;
    }

    try {
        const response = await fetch(getStrapiUrl(`/device-types/${strapiId}`), {
            method: "GET",
            headers: getStrapiHeaders(),
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new ApiError(502, "Failed to fetch device type from CMS");
        }

        const data: IStrapiSingleResponse<IStrapiDeviceType> =
            await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching device type from Strapi:", error);
        throw new ApiError(502, "CMS service unavailable");
    }
};

/**
 * Validate that a Strapi device type ID exists
 */
export const validateDeviceTypeId = async (
    strapiId: number | string
): Promise<boolean> => {
    const deviceType = await fetchDeviceTypeById(strapiId);
    return deviceType !== null && deviceType.status === "active";
};

/**
 * Clear the device type cache (useful for testing or manual refresh)
 */
export const clearDeviceTypeCache = (): void => {
    deviceTypeCache = null;
    cacheTimestamp = 0;
};

/**
 * Get active device types only
 */
export const getActiveDeviceTypes = async (): Promise<IStrapiDeviceType[]> => {
    const allTypes = await fetchDeviceTypes();
    return allTypes.filter((dt) => dt.status === "active");
};

export default {
    fetchDeviceTypes,
    fetchDeviceTypeById,
    validateDeviceTypeId,
    clearDeviceTypeCache,
    getActiveDeviceTypes,
};
