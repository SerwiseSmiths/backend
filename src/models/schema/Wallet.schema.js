"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WalletSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
const WalletModel = mongoose_1.default.model("Wallet", WalletSchema);
exports.default = WalletModel;
//# sourceMappingURL=Wallet.schema.js.map