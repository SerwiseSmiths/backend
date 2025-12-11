"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/complaint.route.ts
const express = require("express");
const complaintController = require("../controllers/complaint.contoller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express.Router();
router.post("/", auth_middleware_1.auth, complaintController.createComplaint);
router.get("/", complaintController.listComplaints);
router.get("/:id", complaintController.getComplaint);
router.put("/:id", complaintController.updateComplaint);
router.delete("/:id", complaintController.deleteComplaint);
// Additional
router.patch("/:id/stage", complaintController.updateStage);
router.patch("/:id/quote", complaintController.addQuote);
exports.default = router;
//# sourceMappingURL=complaint.route.js.map