import { IDevice as DeviceDocument } from "../types/device.type";
export declare const createDevice: (data: Partial<DeviceDocument>) => Promise<import("mongoose").Document<unknown, {}, DeviceDocument, {}, {}> & DeviceDocument & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const retrieveDeviceById: (id: string, populateDeviceType?: boolean) => Promise<any>;
export declare const retrieveDevicesByUserId: (userId: string, populateDeviceType?: boolean) => Promise<any>;
export declare const retrieveAllDevices: (populateDeviceType?: boolean) => Promise<any>;
export declare const updateDeviceById: (id: string, data: Partial<DeviceDocument>, populateDeviceType?: boolean) => Promise<any>;
export declare const softDeleteDevice: (id: string) => Promise<(import("mongoose").Document<unknown, {}, DeviceDocument, {}, {}> & DeviceDocument & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
//# sourceMappingURL=device.repo.d.ts.map