"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AddressSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: { type: String, required: false, trim: true },
    house_no: { type: String, required: true },
    society_name: { type: String, required: true },
    address_line_one: { type: String, required: false },
    address_line_two: { type: String },
    area: { type: String, required: false },
    pin_code: { type: String, required: true, maxlength: 6 },
    city: { type: String, required: true },
    state: { type: String, required: false },
    country: { type: String, required: false, default: "India" },
    latitude: { type: String },
    longitude: { type: String },
    is_deleted: { type: Boolean, default: false },
}, { timestamps: true });
AddressSchema.index({ user: 1, is_deleted: 1 });
const AddressModel = mongoose_1.default.model("Address", AddressSchema);
exports.default = AddressModel;
//# sourceMappingURL=Address.scema.js.map