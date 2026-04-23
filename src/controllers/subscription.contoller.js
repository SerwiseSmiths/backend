"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComplaintCharge = exports.getSubscriptionById = exports.validateSubscription = exports.getMySubscriptions = exports.purchaseSubscription = void 0;
const subService = require("../services/subscription.service");
const purchaseSubscription = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await subService.purchaseSubscription(userId, req.body);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.purchaseSubscription = purchaseSubscription;
const getMySubscriptions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await subService.retrieveSubscriptionsByUser(userId);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getMySubscriptions = getMySubscriptions;
const validateSubscription = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { userSubscriptionId } = req.params;
        const result = await subService.validateSubscriptionForComplaint(userId, userSubscriptionId);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.validateSubscription = validateSubscription;
const getSubscriptionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await subService.getSubscriptionById(id);
        res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getSubscriptionById = getSubscriptionById;
const getComplaintCharge = async (req, res, next) => {
    try {
        const { userSubscriptionId } = req.params;
        const result = await subService.getSubscriptionChargeForComplaint(userSubscriptionId);
        res.status(200).json({ statusCode: 200, message: "Charge computed", data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.getComplaintCharge = getComplaintCharge;
//# sourceMappingURL=subscription.contoller.js.map