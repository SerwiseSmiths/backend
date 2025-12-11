import ApiSuccess from "../utils/api/ApiSuccess.api.util";
export declare const create: (data: any) => Promise<ApiSuccess<{
    deviceType: import("mongoose").Document<unknown, {}, import("../types/deviceType.type").DeviceTypeDocument, {}, {}> & import("../types/deviceType.type").DeviceTypeDocument & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>>;
export declare const retrieveAll: () => Promise<ApiSuccess<{
    deviceTypes: (import("mongoose").Document<unknown, {}, import("../types/deviceType.type").DeviceTypeDocument, {}, {}> & import("../types/deviceType.type").DeviceTypeDocument & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[];
}>>;
export declare const retrieveById: (id: string) => Promise<ApiSuccess<{
    deviceType: import("mongoose").Document<unknown, {}, import("../types/deviceType.type").DeviceTypeDocument, {}, {}> & import("../types/deviceType.type").DeviceTypeDocument & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>>;
export declare const update: (id: string, data: any) => Promise<ApiSuccess<{
    deviceType: (import("mongoose").Document<unknown, {}, import("../types/deviceType.type").DeviceTypeDocument, {}, {}> & import("../types/deviceType.type").DeviceTypeDocument & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null;
}>>;
export declare const softDelete: (id: string) => Promise<ApiSuccess<{
    deviceType: (import("mongoose").Document<unknown, {}, import("../types/deviceType.type").DeviceTypeDocument, {}, {}> & import("../types/deviceType.type").DeviceTypeDocument & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null;
}>>;
//# sourceMappingURL=deviceType.service.d.ts.map