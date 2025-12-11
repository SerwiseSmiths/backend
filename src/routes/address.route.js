"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const addressController = require("../controllers/address.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express.Router();
// CRUD Routes
router.post("/", auth_middleware_1.auth, addressController.createAddress);
router.get("/", auth_middleware_1.auth, addressController.getUserAddresses);
router.get("/:id", addressController.getAddress);
router.put("/:id", addressController.updateAddress);
router.delete("/:id", addressController.deleteAddress);
exports.default = router;
//# sourceMappingURL=address.route.js.map