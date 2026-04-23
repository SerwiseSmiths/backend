"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactsByOwner = exports.upsertContacts = void 0;
const Contact_schema_1 = require("../models/schema/Contact.schema");
const upsertContacts = async (ownerId, contacts) => {
    const doc = await Contact_schema_1.default.findOneAndUpdate({ owner: ownerId }, {
        $set: {
            contacts,
            lastSynced: new Date(),
        },
    }, { upsert: true, new: true });
    return doc;
};
exports.upsertContacts = upsertContacts;
const getContactsByOwner = async (ownerId) => {
    return Contact_schema_1.default.findOne({ owner: ownerId });
};
exports.getContactsByOwner = getContactsByOwner;
//# sourceMappingURL=contact.repo.js.map