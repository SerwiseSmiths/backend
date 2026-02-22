"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debitWalletSchema = exports.creditWalletSchema = void 0;
const Joi = require("joi");
const wallet_type_1 = require("../../types/wallet.type");
exports.creditWalletSchema = Joi.object({
    userId: Joi.string().required(),
    amount: Joi.number().min(1).required(),
    source: Joi.string()
        .valid(...Object.values(wallet_type_1.WalletLedgerSource))
        .required(),
    refId: Joi.string().optional(),
    meta: Joi.object().optional(),
});
exports.debitWalletSchema = Joi.object({
    userId: Joi.string().required(),
    amount: Joi.number().min(1).required(),
    source: Joi.string()
        .valid(...Object.values(wallet_type_1.WalletLedgerSource))
        .required(),
    refId: Joi.string().optional(),
    meta: Joi.object().optional(),
});
//# sourceMappingURL=wallet.validation.js.map