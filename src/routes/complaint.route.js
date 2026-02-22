"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/complaint.route.ts
const express = require("express");
const complaintController = require("../controllers/complaint.contoller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express.Router();
// CRUD operations
router.post("/", auth_middleware_1.auth, complaintController.createComplaint);
router.get("/", complaintController.listComplaints);
router.get("/my", auth_middleware_1.auth, complaintController.listMyComplaints);
router.get("/provider", auth_middleware_1.auth, complaintController.listProviderComplaints);
router.get("/:id", complaintController.getComplaint);
router.put("/:id", auth_middleware_1.auth, complaintController.updateComplaint);
router.delete("/:id", auth_middleware_1.auth, complaintController.deleteComplaint);
// Stage and status updates
router.patch("/:id/stage", auth_middleware_1.auth, complaintController.updateStage);
// Add related entities
router.patch("/:id/quote", auth_middleware_1.auth, complaintController.addQuote);
router.patch("/:id/device", auth_middleware_1.auth, complaintController.addDevice);
router.patch("/:id/payment", auth_middleware_1.auth, complaintController.addPayment);
// Reopen complaint
router.post("/:id/reopen", auth_middleware_1.auth, complaintController.reopenComplaint);
// Provider accepts/rejects assignment
router.patch("/:id/accept", auth_middleware_1.auth, complaintController.acceptComplaintAssignment);
router.patch("/:id/reject-assignment", auth_middleware_1.auth, complaintController.rejectComplaintAssignment);
// QR Entry validation
router.post("/:id/qr/generate", auth_middleware_1.auth, complaintController.generateEntryQr);
router.post("/:id/qr/validate", auth_middleware_1.auth, complaintController.validateEntryQr);
exports.default = router;
//# sourceMappingURL=complaint.route.js.map