import * as Joi from "joi";
import { WalletLedgerSource } from "../../types/wallet.type";

export const creditWalletSchema = Joi.object({
    userId: Joi.string().required(),
    amount: Joi.number().min(1).required(),
    source: Joi.string()
        .valid(...Object.values(WalletLedgerSource))
        .required(),
    refId: Joi.string().optional(),
    meta: Joi.object().optional(),
});

export const debitWalletSchema = Joi.object({
    userId: Joi.string().required(),
    amount: Joi.number().min(1).required(),
    source: Joi.string()
        .valid(...Object.values(WalletLedgerSource))
        .required(),
    refId: Joi.string().optional(),
    meta: Joi.object().optional(),
});
