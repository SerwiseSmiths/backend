"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = exports.getAll = exports.markTruecallerNotified = exports.create = exports.findByPhoneNo = void 0;
const Waitlist_schema_1 = require("../models/schema/Waitlist.schema");
const findByPhoneNo = async (phoneNo) => {
    return Waitlist_schema_1.default.findOne({ phoneNo });
};
exports.findByPhoneNo = findByPhoneNo;
const create = async (data) => {
    return Waitlist_schema_1.default.create(data);
};
exports.create = create;
const markTruecallerNotified = async (phoneNo) => {
    await Waitlist_schema_1.default.updateOne({ phoneNo }, { notifiedViaTruecaller: true, truecallerNotifiedAt: new Date() });
};
exports.markTruecallerNotified = markTruecallerNotified;
const getAll = async () => {
    return Waitlist_schema_1.default.find().sort({ joinedAt: -1 });
};
exports.getAll = getAll;
const count = async () => {
    return Waitlist_schema_1.default.countDocuments();
};
exports.count = count;
//# sourceMappingURL=waitlist.repo.js.map