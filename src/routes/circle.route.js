"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const circleController = require("../controllers/circle.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.auth);
router.post("/create", circleController.createCircle);
router.post("/join", circleController.joinCircleByLink);
router.post("/promote", circleController.promoteToAdmin);
router.get("/mutual-circles", circleController.getMutualCircles);
exports.default = router;
//# sourceMappingURL=circle.route.js.map