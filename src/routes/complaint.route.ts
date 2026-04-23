// routes/complaint.route.ts
import { Router } from "express";
import * as complaintController from "../controllers/complaint.contoller";
import { auth } from "../middlewares/auth.middleware";

const router: Router = Router();

// CRUD operations
router.post("/", auth, complaintController.createComplaint);
router.get("/", complaintController.listComplaints);
router.get("/my", auth, complaintController.listMyComplaints);
router.get("/provider", auth, complaintController.listProviderComplaints);
router.get("/provider/open", auth, complaintController.listOpenProviderComplaints);
router.get("/:id", complaintController.getComplaint);
router.put("/:id", auth, complaintController.updateComplaint);
router.delete("/:id", auth, complaintController.deleteComplaint);

// Stage and status updates
router.patch("/:id/stage", auth, complaintController.updateStage);

// Add related entities
router.patch("/:id/quote", auth, complaintController.addQuote);
router.patch("/:id/device", auth, complaintController.addDevice);
router.patch("/:id/payment", auth, complaintController.addPayment);

// Reopen complaint
router.post("/:id/reopen", auth, complaintController.reopenComplaint);

// Provider accepts/rejects assignment
router.patch("/:id/accept", auth, complaintController.acceptComplaintAssignment);
router.patch("/:id/reject-assignment", auth, complaintController.rejectComplaintAssignment);

// QR Entry validation
router.post("/:id/qr/generate", auth, complaintController.generateEntryQr);
router.post("/:id/qr/validate", auth, complaintController.validateEntryQr);
router.post("/:id/qr/request-scan", auth, complaintController.requestEntranceScan);

export default router;
