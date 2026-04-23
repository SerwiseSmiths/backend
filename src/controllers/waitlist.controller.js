"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWaitlist = exports.joinWaitlist = void 0;
const WaitlistService = require("../services/waitlist.service");
const joinWaitlist = async (req, res, next) => {
    try {
        const { phoneNo, countryCode, source } = req.body;
        const result = await WaitlistService.joinWaitlist(phoneNo, countryCode, source);
        return res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.joinWaitlist = joinWaitlist;
const getWaitlist = async (req, res, next) => {
    try {
        const result = await WaitlistService.getWaitlist();
        return res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getWaitlist = getWaitlist;
//# sourceMappingURL=waitlist.controller.js.map