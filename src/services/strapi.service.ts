// Strapi CMS Service
// Fetches device types and other content from Strapi CMS

import { getStrapiHeaders, getStrapiUrl } from "../config/strapi.config";
import {
  IStrapiDeviceType,
  IStrapiResponse,
  IStrapiSingleResponse,
} from "../types/strapi.type";
import ApiError from "../utils/api/ApiError.api.util";
import { serverQueryClient } from "../utils/serverQueryClient";

const DEVICE_TYPES_QUERY_KEY = ["strapi", "device-types"];

/**
 * Fetch all device types from Strapi CMS
 */
export const fetchDeviceTypes = async (): Promise<IStrapiDeviceType[]> => {
  return serverQueryClient.fetchQuery({
    queryKey: DEVICE_TYPES_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await fetch(getStrapiUrl("/device-types"), {
          method: "GET",
          headers: getStrapiHeaders(),
        });

        if (!response.ok) {
          console.warn(
            `Strapi API returned ${response.status}: ${response.statusText}`
          );
          throw new ApiError(502, "Failed to fetch device types from CMS");
        }

        const data: IStrapiResponse<IStrapiDeviceType> = await response.json();
        return data.data;
      } catch (error) {
        console.error("Error fetching device types from Strapi:", error);
        throw new ApiError(502, "CMS service unavailable");
      }
    },
  });
};

/**
 * Fetch a single device type by Strapi ID
 */
export const fetchDeviceTypeById = async (
    strapiId: number | string
): Promise<IStrapiDeviceType | null> => {
    // Prefer the cached list when available
    try {
        const allTypes = await fetchDeviceTypes();
        const fromList = allTypes.find((dt) => dt.id === Number(strapiId));
        if (fromList) {
            return fromList;
        }
    } catch {
        // Fall through to direct fetch if list query fails
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
    serverQueryClient.removeQueries({ queryKey: DEVICE_TYPES_QUERY_KEY });
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
