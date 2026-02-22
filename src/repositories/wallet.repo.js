"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLedgerByUserId = exports.getLedgerByWalletId = exports.createLedgerEntry = exports.updateWalletBalance = exports.getWalletByUserId = exports.createWallet = void 0;
const Wallet_schema_1 = require("../models/schema/Wallet.schema");
const WalletLedger_schema_1 = require("../models/schema/WalletLedger.schema");
// ==========================================
// Wallet Operations
// ==========================================
const createWallet = async (userId) => {
    const existingWallet = await Wallet_schema_1.default.findOne({ user: userId });
    if (existingWallet) {
        return existingWallet;
    }
    const wallet = new Wallet_schema_1.default({
        user: userId,
        balance: 0,
    });
    return (await wallet.save());
};
exports.createWallet = createWallet;
const getWalletByUserId = async (userId) => {
    return (await Wallet_schema_1.default.findOne({ user: userId }));
};
exports.getWalletByUserId = getWalletByUserId;
const updateWalletBalance = async (userId, amount, // can be positive or negative
session) => {
    return (await Wallet_schema_1.default.findOneAndUpdate({ user: userId }, { $inc: { balance: amount } }, { new: true, session }));
};
exports.updateWalletBalance = updateWalletBalance;
// ==========================================
// Ledger Operations
// ==========================================
const createLedgerEntry = async (entry, session) => {
    const ledger = new WalletLedger_schema_1.default(entry);
    return (await ledger.save({ session }));
};
exports.createLedgerEntry = createLedgerEntry;
const getLedgerByWalletId = async (walletId, limit = 20, skip = 0) => {
    return (await WalletLedger_schema_1.default.find({ wallet: walletId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit));
};
exports.getLedgerByWalletId = getLedgerByWalletId;
const getLedgerByUserId = async (userId, limit = 20, skip = 0) => {
    return (await WalletLedger_schema_1.default.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit));
};
exports.getLedgerByUserId = getLedgerByUserId;
//# sourceMappingURL=wallet.repo.js.map