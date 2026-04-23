"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PhoneNumberSchema = new mongoose_1.Schema({
    label: { type: String, default: "mobile" },
    number: { type: String, required: true, trim: true },
}, { _id: false });
const EmailAddressSchema = new mongoose_1.Schema({
    label: { type: String, default: "home" },
    email: { type: String, lowercase: true, trim: true },
}, { _id: false });
const ContactEntrySchema = new mongoose_1.Schema({
    deviceRecordId: { type: String },
    name: { type: String, trim: true, default: "" },
    phoneNumbers: { type: [PhoneNumberSchema], default: [] },
    emailAddresses: { type: [EmailAddressSchema], default: [] },
}, { _id: false });
const ContactSchema = new mongoose_1.Schema({
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    contacts: { type: [ContactEntrySchema], default: [] },
    lastSynced: { type: Date, default: Date.now },
}, { timestamps: true });
const ContactModel = mongoose_1.default.model("Contact", ContactSchema);
exports.default = ContactModel;
//# sourceMappingURL=Contact.schema.js.map