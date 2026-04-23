import mongoose, { Document } from "mongoose";
export interface ICircle extends Document {
    name: string;
    description?: string;
    admins: mongoose.Types.ObjectId[];
    members: mongoose.Types.ObjectId[];
    invitationCode: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const CircleModel: mongoose.Model<ICircle, {}, {}, {}, mongoose.Document<unknown, {}, ICircle, {}, {}> & ICircle & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default CircleModel;
//# sourceMappingURL=Circle.schema.d.ts.map