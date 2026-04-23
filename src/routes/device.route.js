"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller = require("../controllers/device.controller");
const router = (0, express_1.Router)();
router.post("/", controller.createDevice);
router.get("/", controller.getDevices);
router.get("/user/:userId", controller.getUserDevices);
router.get("/:id", controller.getDevice);
router.put("/:id", controller.updateDevice);
router.delete("/:id", controller.deleteDevice);
exports.default = router;
//# sourceMappingURL=device.route.js.map