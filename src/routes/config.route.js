"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configController = require("../controllers/config.controller");
const router = (0, express_1.Router)();
router.get("/app-version", configController.getAppVersion);
router.get("/serwise", configController.getSerwiseConfig);
router.get("/radix", configController.getRadixConfig);
exports.default = router;
//# sourceMappingURL=config.route.js.map