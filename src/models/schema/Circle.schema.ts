import mongoose, { Schema, Document } from "mongoose";

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

const CircleSchema = new Schema<ICircle>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        admins: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
        members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
        invitationCode: { type: String, unique: true, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const CircleModel = mongoose.model<ICircle>("Circle", CircleSchema);
export default CircleModel;
