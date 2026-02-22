import { IStrapiDeviceType } from "../types/strapi.type";
/**
 * Fetch all device types from Strapi CMS
 */
export declare const fetchDeviceTypes: () => Promise<IStrapiDeviceType[]>;
/**
 * Fetch a single device type by Strapi ID
 */
export declare const fetchDeviceTypeById: (strapiId: number | string) => Promise<IStrapiDeviceType | null>;
/**
 * Validate that a Strapi device type ID exists
 */
export declare const validateDeviceTypeId: (strapiId: number | string) => Promise<boolean>;
/**
 * Clear the device type cache (useful for testing or manual refresh)
 */
export declare const clearDeviceTypeCache: () => void;
/**
 * Get active device types only
 */
export declare const getActiveDeviceTypes: () => Promise<IStrapiDeviceType[]>;
declare const _default: {
    fetchDeviceTypes: () => Promise<IStrapiDeviceType[]>;
    fetchDeviceTypeById: (strapiId: number | string) => Promise<IStrapiDeviceType | null>;
    validateDeviceTypeId: (strapiId: number | string) => Promise<boolean>;
    clearDeviceTypeCache: () => void;
    getActiveDeviceTypes: () => Promise<IStrapiDeviceType[]>;
};
export default _default;
//# sourceMappingURL=strapi.service.d.ts.map