// Strapi CMS Configuration

export interface IStrapiConfig {
    apiUrl: string;
    apiToken: string;
}

const strapiConfig: IStrapiConfig = {
    apiUrl: process.env.STRAPI_API_URL || "http://localhost:1337",
    apiToken: process.env.STRAPI_API_TOKEN || "",
};

export const getStrapiHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    ...(strapiConfig.apiToken && {
        Authorization: `Bearer ${strapiConfig.apiToken}`,
    }),
});

export const getStrapiUrl = (endpoint: string): string => {
    const baseUrl = strapiConfig.apiUrl.replace(/\/$/, "");
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${baseUrl}/api${path}`;
};

export default strapiConfig;
