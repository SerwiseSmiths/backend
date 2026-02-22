"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controller = require("../controllers/deviceType.contoller");
const router = express.Router();
router.post("/", controller.createDeviceType);
router.get("/", controller.getDeviceTypes);
router.get("/:id", controller.getDeviceType);
router.put("/:id", controller.updateDeviceType);
router.delete("/:id", controller.deleteDeviceType);
exports.default = router;
//# sourceMappingURL=deviceType.route.js.map