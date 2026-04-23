export interface IStrapiDeviceType {
    id: number;
    documentId: string;
    name: string;
    state: "active" | "inactive" | "ACTIVE" | "INACTIVE";
    icon: string;
}
export interface IStrapiResponse<T> {
    data?: T[];
    results?: T[];
    meta?: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}
export interface IStrapiSingleResponse<T> {
    data?: T;
    meta?: {};
    id?: number;
    documentId?: string;
}
export interface IStrapiConfig {
    apiUrl: string;
    apiToken: string;
}
//# sourceMappingURL=strapi.type.d.ts.map