"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const quoteController = require("../controllers/quote.contoller");
const router = express.Router();
router.post("/", quoteController.createQuote);
router.get("/", quoteController.getAllQuotes);
router.get("/:id", quoteController.getQuoteById);
router.patch("/:id", quoteController.updateQuote);
router.delete("/:id", quoteController.deleteQuote);
exports.default = router;
//# sourceMappingURL=quote.route.js.map