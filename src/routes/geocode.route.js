"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const geocode_controller_1 = require("../controllers/geocode.controller");
const router = (0, express_1.Router)();
router.post("/", geocode_controller_1.getLatLngFromAddress);
exports.default = router;
//# sourceMappingURL=geocode.route.js.map