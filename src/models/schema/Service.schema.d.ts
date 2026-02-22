import { Document } from "mongoose";
export interface IService extends Document {
    name: string;
    price: number;
    title: string;
}
export declare const ServiceModel: import("mongoose").Model<IService, {}, {}, {}, Document<unknown, {}, IService, {}, {}> & IService & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Service.schema.d.ts.map