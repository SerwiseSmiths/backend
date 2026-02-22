"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authContoller = require("../controllers/auth.controller");
const express = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express.Router();
router.post("/login", authContoller.login);
router.get("/me", auth_middleware_1.auth, authContoller.me); // Protected: returns current user profile
exports.default = router;
//# sourceMappingURL=auth.route.js.map