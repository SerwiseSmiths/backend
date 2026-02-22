"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const wallet_type_1 = require("../../types/wallet.type");
const WalletLedgerSchema = new mongoose_1.Schema({
    wallet: {
        type: String, // Storing as String to match other foreign keys in project which seem to be strings often, but usually ObjectId is better. Following pattern if User.schema uses String for ref or ObjectId. Wait, User.schema has no direct refs shown but checking Transaction.schema it uses String for userId. So sticking to String if that's the pattern, but usually for `ref` it should be ObjectId. Let's check User.schema again. 
        // User.schema uses `_id` which is ObjectId by default. Transaction schema uses `userId: { type: String }`.
        // To be safe and relational, I will use Schema.Types.ObjectId.
        ref: "Wallet",
        required: true,
        index: true,
    },
    user: {
        type: String,
        ref: "User",
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: Object.values(wallet_type_1.WalletLedgerType),
        required: true,
    },
    source: {
        type: String,
        enum: Object.values(wallet_type_1.WalletLedgerSource),
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    openingBalance: {
        type: Number,
        required: true,
    },
    closingBalance: {
        type: Number,
        required: true,
    },
    refId: {
        type: String,
        required: false,
        index: true,
    },
    meta: {
        type: Object,
        default: {},
    },
}, {
    timestamps: true,
});
// Indexes for faster queries
WalletLedgerSchema.index({ user: 1, createdAt: -1 });
WalletLedgerSchema.index({ wallet: 1, createdAt: -1 });
const WalletLedgerModel = mongoose_1.default.model("WalletLedger", WalletLedgerSchema);
exports.default = WalletLedgerModel;
//# sourceMappingURL=WalletLedger.schema.js.map