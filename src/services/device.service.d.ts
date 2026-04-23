import ApiSuccess from "../utils/api/ApiSuccess.api.util";
export declare const create: (data: any) => Promise<ApiSuccess<{
    device: import("mongoose").Document<unknown, {}, import("../types/device.type").IDevice, {}, {}> & import("../types/device.type").IDevice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>>;
export declare const retrieve: (id: string) => Promise<ApiSuccess<{
    device: any;
}>>;
export declare const retrieveAll: () => Promise<ApiSuccess<{
    devices: any;
}>>;
export declare const update: (id: string, data: any) => Promise<ApiSuccess<{
    device: any;
}>>;
export declare const softDelete: (id: string) => Promise<ApiSuccess<{
    device: (import("mongoose").Document<unknown, {}, import("../types/device.type").IDevice, {}, {}> & import("../types/device.type").IDevice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null;
}>>;
export declare const getDevicesByUser: (userId: string) => Promise<any>;
export declare const retrieveByUser: (userId: string) => Promise<ApiSuccess<{
    devices: any;
}>>;
//# sourceMappingURL=device.service.d.ts.map