"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quoteController = require("../controllers/quote.contoller");
const router = (0, express_1.Router)();
router.post("/", quoteController.createQuote);
router.get("/", quoteController.getAllQuotes);
router.get("/:id", quoteController.getQuoteById);
router.patch("/:id", quoteController.updateQuote);
router.patch("/:id/status", quoteController.updateQuoteStatus);
router.delete("/:id", quoteController.deleteQuote);
exports.default = router;
//# sourceMappingURL=quote.route.js.map