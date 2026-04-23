"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authContoller = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/login", authContoller.login);
router.post("/otp/generate", authContoller.generateOtp);
router.post("/otp/verify", authContoller.verifyOtp);
router.post("/truecaller/verify", authContoller.truecallerAuth);
router.post("/truecaller/oauth", authContoller.truecallerOAuthAuth);
router.post("/refresh", authContoller.refreshToken);
router.get("/me", auth_middleware_1.auth, authContoller.me); // Protected: returns current user profile
exports.default = router;
//# sourceMappingURL=auth.route.js.map