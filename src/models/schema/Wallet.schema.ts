import mongoose, { Schema, Model } from "mongoose";
import { IWallet, WalletDocument } from "../../types/wallet.type";

const WalletSchema = new Schema<IWallet>(
    {
        user: {
            type: String,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        balance: {
            type: Number,
            default: 0,
            min: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const WalletModel: Model<IWallet> = mongoose.model<IWallet>(
    "Wallet",
    WalletSchema
);
export default WalletModel;
