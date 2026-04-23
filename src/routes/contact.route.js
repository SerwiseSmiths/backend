"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const contactController = require("../controllers/contact.controller");
const router = (0, express_1.Router)();
// POST /contacts/sync  — upload/replace all device contacts for the logged-in user
router.post("/sync", auth_middleware_1.auth, contactController.syncContacts);
// GET  /contacts       — fetch the stored contacts for the logged-in user
router.get("/", auth_middleware_1.auth, contactController.getContacts);
exports.default = router;
//# sourceMappingURL=contact.route.js.map