"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authContoller = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();
router.post("/login", authContoller.login);
exports.default = router;
//# sourceMappingURL=auth.route.js.map