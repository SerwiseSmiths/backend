"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentRemaining = exports.updateState = exports.getAllSubscriptions = exports.getSubscriptionById = exports.createSubscription = void 0;
const subService = require("../services/subscription.service");
// import ApiError from "../utils/api/ApiError.api.util";
const createSubscription = async (req, res, next) => {
    try {
        const userId = req.user.id; // from auth middleware
        const result = await subService.createSubscription(userId, req.body);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.createSubscription = createSubscription;
const getSubscriptionById = async (req, res, next) => {
    try {
        const result = await subService.retrieveSubscriptionById(req.params.id);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getSubscriptionById = getSubscriptionById;
const getAllSubscriptions = async (req, res, next) => {
    try {
        const result = await subService.retrieveAllSubscriptions();
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllSubscriptions = getAllSubscriptions;
const updateState = async (req, res, next) => {
    try {
        const { state } = req.body;
        const result = await subService.changeState(req.params.id, state);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.updateState = updateState;
const updatePaymentRemaining = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const result = await subService.updatePaymentRemaining(req.params.id, amount);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.updatePaymentRemaining = updatePaymentRemaining;
//# sourceMappingURL=subscription.contoller.js.map