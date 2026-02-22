export interface IStrapiDeviceType {
    id: number;
    name: string;
    status: "active" | "inactive";
    icon: string;
}
export interface IStrapiResponse<T> {
    data: T[];
    meta: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}
export interface IStrapiSingleResponse<T> {
    data: T;
    meta: {};
}
export interface IStrapiConfig {
    apiUrl: string;
    apiToken: string;
}
//# sourceMappingURL=strapi.type.d.ts.map