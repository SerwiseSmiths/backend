import { DeviceTypeDocument } from "../types/deviceType.type";
export declare const createDeviceType: (data: Partial<DeviceTypeDocument>) => Promise<import("mongoose").Document<unknown, {}, DeviceTypeDocument, {}, {}> & DeviceTypeDocument & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const getAllDeviceTypes: () => Promise<(import("mongoose").Document<unknown, {}, DeviceTypeDocument, {}, {}> & DeviceTypeDocument & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
})[]>;
export declare const getDeviceTypeById: (id: string) => Promise<(import("mongoose").Document<unknown, {}, DeviceTypeDocument, {}, {}> & DeviceTypeDocument & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
export declare const updateDeviceType: (id: string, data: Partial<DeviceTypeDocument>) => Promise<(import("mongoose").Document<unknown, {}, DeviceTypeDocument, {}, {}> & DeviceTypeDocument & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
export declare const softDeleteDeviceType: (id: string) => Promise<(import("mongoose").Document<unknown, {}, DeviceTypeDocument, {}, {}> & DeviceTypeDocument & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
//# sourceMappingURL=deviceType.repo.d.ts.map