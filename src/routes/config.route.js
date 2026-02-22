"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const configController = require("../controllers/config.controller");
const router = express.Router();
router.get("/app-version", configController.getAppVersion);
exports.default = router;
//# sourceMappingURL=config.route.js.map