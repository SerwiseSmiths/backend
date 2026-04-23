"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteModel = void 0;
const mongoose_1 = require("mongoose");
const quoteSchema = new mongoose_1.Schema({
    items: [{ type: mongoose_1.Schema.Types.Mixed }], // Strapi part IDs (can be string or number)
    total: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
});
exports.QuoteModel = (0, mongoose_1.model)("Quote", quoteSchema);
//# sourceMappingURL=Quote.schema.js.map