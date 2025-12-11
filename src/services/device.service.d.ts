import ApiSuccess from "../utils/api/ApiSuccess.api.util";
export declare const create: (data: any) => Promise<ApiSuccess<{
    device: import("mongoose").Document<unknown, {}, import("../types/device.type").IDevice, {}, {}> & import("../types/device.type").IDevice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>>;
export declare const retrieve: (id: string) => Promise<ApiSuccess<{
    device: import("mongoose").Document<unknown, {}, import("../types/device.type").IDevice, {}, {}> & import("../types/device.type").IDevice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    };
}>>;
export declare const retrieveAll: () => Promise<ApiSuccess<{
    devices: (import("mongoose").Document<unknown, {}, import("../types/device.type").IDevice, {}, {}> & import("../types/device.type").IDevice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[];
}>>;
export declare const update: (id: string, data: any) => Promise<ApiSuccess<{
    device: (import("mongoose").Document<unknown, {}, import("../types/device.type").IDevice, {}, {}> & import("../types/device.type").IDevice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null;
}>>;
export declare const softDelete: (id: string) => Promise<ApiSuccess<{
    device: (import("mongoose").Document<unknown, {}, import("../types/device.type").IDevice, {}, {}> & import("../types/device.type").IDevice & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null;
}>>;
//# sourceMappingURL=device.service.d.ts.map