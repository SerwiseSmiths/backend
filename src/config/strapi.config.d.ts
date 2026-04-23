export interface IStrapiConfig {
    apiUrl: string;
    apiToken: string;
}
declare const strapiConfig: IStrapiConfig;
export declare const getStrapiHeaders: () => HeadersInit;
export declare const getStrapiUrl: (endpoint: string) => string;
export default strapiConfig;
//# sourceMappingURL=strapi.config.d.ts.map