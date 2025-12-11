import { IDevice as DeviceDocument } from "../types/device.type";
export declare const createDevice: (data: Partial<DeviceDocument>) => Promise<import("mongoose").Document<unknown, {}, DeviceDocument, {}, {}> & DeviceDocument & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const retrieveDeviceById: (id: string) => Promise<(import("mongoose").Document<unknown, {}, DeviceDocument, {}, {}> & DeviceDocument & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
export declare const retrieveAllDevices: () => Promise<(import("mongoose").Document<unknown, {}, DeviceDocument, {}, {}> & DeviceDocument & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
})[]>;
export declare const updateDeviceById: (id: string, data: Partial<DeviceDocument>) => Promise<(import("mongoose").Document<unknown, {}, DeviceDocument, {}, {}> & DeviceDocument & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
export declare const softDeleteDevice: (id: string) => Promise<(import("mongoose").Document<unknown, {}, DeviceDocument, {}, {}> & DeviceDocument & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
//# sourceMappingURL=device.repo.d.ts.map