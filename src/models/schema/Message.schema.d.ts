import mongoose, { Document } from "mongoose";
export interface IMessage extends Document {
    sender: mongoose.Types.ObjectId;
    recipientType: "User" | "Circle";
    recipientId: mongoose.Types.ObjectId;
    content: string;
    type: "text" | "image" | "complaint" | "call_log";
    complaintId?: mongoose.Types.ObjectId;
    readBy: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
declare const MessageModel: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}, {}> & IMessage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default MessageModel;
//# sourceMappingURL=Message.schema.d.ts.map