"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WaitlistController = require("../controllers/waitlist.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public — anyone can join
router.post("/join", WaitlistController.joinWaitlist);
// Admin only — requires auth
router.get("/", auth_middleware_1.auth, WaitlistController.getWaitlist);
exports.default = router;
//# sourceMappingURL=waitlist.route.js.map