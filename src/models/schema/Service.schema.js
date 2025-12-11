"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceModel = void 0;
const mongoose_1 = require("mongoose");
const serviceSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    title: { type: String, required: true },
});
exports.ServiceModel = (0, mongoose_1.model)("Service", serviceSchema);
//# sourceMappingURL=Service.schema.js.map