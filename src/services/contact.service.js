"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContacts = exports.syncContacts = void 0;
const ContactRepo = require("../repositories/contact.repo");
const ApiSuccess_api_util_1 = require("../utils/api/ApiSuccess.api.util");
const ApiError_api_util_1 = require("../utils/api/ApiError.api.util");
const syncContacts = async (ownerId, contacts) => {
    if (!Array.isArray(contacts)) {
        throw new ApiError_api_util_1.default(400, "contacts must be an array");
    }
    // Sanitise: keep only entries that have at least one phone number
    const sanitised = contacts
        .filter((c) => Array.isArray(c.phoneNumbers) && c.phoneNumbers.length > 0)
        .map((c) => {
        const entry = {
            name: c.name ?? "",
            phoneNumbers: c.phoneNumbers.map((p) => ({
                label: p.label ?? "mobile",
                number: p.number,
            })),
            emailAddresses: (c.emailAddresses ?? []).map((e) => ({
                label: e.label ?? "home",
                email: e.email,
            })),
        };
        if (c.deviceRecordId) {
            entry.deviceRecordId = c.deviceRecordId;
        }
        return entry;
    });
    const doc = await ContactRepo.upsertContacts(ownerId, sanitised);
    return new ApiSuccess_api_util_1.default(200, "Contacts synced successfully", {
        totalSynced: sanitised.length,
        lastSynced: doc.lastSynced,
    });
};
exports.syncContacts = syncContacts;
const getContacts = async (ownerId) => {
    const doc = await ContactRepo.getContactsByOwner(ownerId);
    return new ApiSuccess_api_util_1.default(200, "Contacts fetched successfully", {
        contacts: doc?.contacts ?? [],
        lastSynced: doc?.lastSynced ?? null,
    });
};
exports.getContacts = getContacts;
//# sourceMappingURL=contact.service.js.map