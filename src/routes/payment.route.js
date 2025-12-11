"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_contoller_1 = require("../controllers/payment.contoller");
const router = (0, express_1.Router)();
router.post("/create-order", payment_contoller_1.default.createPayment);
router.post("/webhook", payment_contoller_1.default.webhook); // Cashfree → Server
exports.default = router;
//# sourceMappingURL=payment.route.js.map