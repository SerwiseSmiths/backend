import {Schema} from "mongoose";

export interface DeviceDocument extends Document {
  name: string;
  deviceType: Schema.Types.ObjectId;
  description?: string;
  user: Schema.Types.ObjectId;
  address: Schema.Types.ObjectId;   // <-- updated
  isDeleted: boolean;
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
  location: string;
}
