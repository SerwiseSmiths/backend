"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controller = require("../controllers/device.controller");
const router = express.Router();
router.post("/", controller.createDevice);
router.get("/", controller.getDevices);
router.get("/:id", controller.getDevice);
router.put("/:id", controller.updateDevice);
router.delete("/:id", controller.deleteDevice);
exports.default = router;
//# sourceMappingURL=device.route.js.map