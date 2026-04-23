import { IStrapiDeviceType } from "../types/strapi.type";
/**
 * Fetch all device types from Strapi CMS
 */
export declare const fetchDeviceTypes: () => Promise<IStrapiDeviceType[]>;
/**
 * Fetch a single device type by Strapi documentId
 */
export declare const fetchDeviceTypeById: (documentId: string) => Promise<IStrapiDeviceType | null>;
/**
 * Validate that a Strapi device type documentId exists
 */
export declare const validateDeviceTypeId: (documentId: string) => Promise<boolean>;
/**
 * Clear the device type cache (useful for testing or manual refresh)
 */
export declare const clearDeviceTypeCache: () => void;
/**
 * Get active device types only
 */
export declare const getActiveDeviceTypes: () => Promise<IStrapiDeviceType[]>;
/**
 * Generic fetch from Strapi REST API
 */
export declare const fetchFromStrapi: (path: string) => Promise<any>;
/**
 * Fetch signup bonus configuration from Strapi single type
 */
export declare const fetchSignupBonusConfig: () => Promise<{
    enabled: boolean;
    bonusAmount: number;
} | null>;
declare const _default: {
    fetchDeviceTypes: () => Promise<IStrapiDeviceType[]>;
    fetchDeviceTypeById: (documentId: string) => Promise<IStrapiDeviceType | null>;
    validateDeviceTypeId: (documentId: string) => Promise<boolean>;
    clearDeviceTypeCache: () => void;
    getActiveDeviceTypes: () => Promise<IStrapiDeviceType[]>;
    fetchFromStrapi: (path: string) => Promise<any>;
    fetchSignupBonusConfig: () => Promise<{
        enabled: boolean;
        bonusAmount: number;
    } | null>;
};
export default _default;
//# sourceMappingURL=strapi.service.d.ts.map