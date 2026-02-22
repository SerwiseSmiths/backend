"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteModel = void 0;
const mongoose_1 = require("mongoose");
const quoteSchema = new mongoose_1.Schema({
    items: [{ type: Number }], // Strapi part IDs (integers)
    total: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
});
exports.QuoteModel = (0, mongoose_1.model)("Quote", quoteSchema);
//# sourceMappingURL=Quote.schema.js.map