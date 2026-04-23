import { Schema } from "mongoose";
export interface IDevice extends Document {
    name: string;
    deviceType: string;
    description?: string;
    user: Schema.Types.ObjectId;
    address: Schema.Types.ObjectId;
    isDeleted: boolean;
    lastServicedAt?: Date;
    serviceHistory?: {
        complaintId: string;
        servicedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
export interface DeviceDescription {
    basic: {
        spun: number;
        sediment: number;
        pre: number;
        post: number;
        UV: number;
        UF: number;
        RO: number;
        TDS: number;
        Alkaline: number;
    };
    additional: {
        CU: number;
        zn: number;
        MG: number;
        ca: number;
        other: number;
    };
    age: number;
    storageCapacity: number;
    purchaseDate?: string;
    location: string;
}
//# sourceMappingURL=device.type.d.ts.map