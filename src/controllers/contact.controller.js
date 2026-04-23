"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContacts = exports.syncContacts = void 0;
const contactService = require("../services/contact.service");
const syncContacts = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { contacts } = req.body;
        const result = await contactService.syncContacts(userId, contacts);
        return res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.syncContacts = syncContacts;
const getContacts = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await contactService.getContacts(userId);
        return res.status(result.statusCode).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.getContacts = getContacts;
//# sourceMappingURL=contact.controller.js.map