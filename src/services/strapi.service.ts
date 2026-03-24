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
        const query = `
          query {
            deviceTypes(pagination: { limit: 100 }) {
              documentId
              type
              state
            }
          }
        `;
        const response = await fetch(getStrapiUrl("/graphql"), {
          method: "POST",
          headers: { ...getStrapiHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          console.warn(
            `Strapi API returned ${response.status}: ${response.statusText}`
          );
          throw new ApiError(502, "Failed to fetch device types from CMS");
        }

        const data: any = await response.json();
        return data.data?.deviceTypes || [];
      } catch (error) {
        console.error("Error fetching device types from Strapi:", error);
        throw new ApiError(502, "CMS service unavailable");
      }
    },
  });
};

/**
 * Fetch a single device type by Strapi documentId
 */
export const fetchDeviceTypeById = async (
  documentId: string
): Promise<IStrapiDeviceType | null> => {
  // Prefer the cached list when available
  try {
    const allTypes = await fetchDeviceTypes();
    const fromList = allTypes.find((dt) => dt.documentId === documentId);
    if (fromList) {
      return fromList;
    }
  } catch {
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
    const response = await fetch(getStrapiUrl(`/graphql`), {
      method: "POST",
      headers: { ...getStrapiHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { documentId } }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new ApiError(502, "Failed to fetch device type from CMS");
    }

    const data: any = await response.json();
    return data.data?.deviceType || null;
  } catch (error) {
    console.error("Error fetching device type from Strapi:", error);
    throw new ApiError(502, "CMS service unavailable");
  }
};

/**
 * Validate that a Strapi device type documentId exists
 */
export const validateDeviceTypeId = async (
  documentId: string
): Promise<boolean> => {
  const deviceType = await fetchDeviceTypeById(documentId);
  return deviceType !== null && (deviceType.state === "active" || deviceType.state === "ACTIVE");
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
  return allTypes.filter((dt) => dt.state === "active");
};

/**
 * Generic fetch from Strapi REST API
 */
export const fetchFromStrapi = async (path: string): Promise<any> => {
  try {
    const url = getStrapiUrl(`/api${path}`);
    const response = await fetch(url, {
      headers: getStrapiHeaders(),
    });

    if (!response.ok) {
      console.warn(`Strapi REST API returned ${response.status}: ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from Strapi (${path}):`, error);
    return null;
  }
};

export default {
  fetchDeviceTypes,
  fetchDeviceTypeById,
  validateDeviceTypeId,
  clearDeviceTypeCache,
  getActiveDeviceTypes,
  fetchFromStrapi,
};
