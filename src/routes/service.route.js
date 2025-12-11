"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const serviceController = require("../controllers/service.contoller");
const router = express.Router();
router.post("/", serviceController.createService);
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);
router.patch("/:id", serviceController.updateService);
router.delete("/:id", serviceController.deleteService);
exports.default = router;
//# sourceMappingURL=service.route.js.map