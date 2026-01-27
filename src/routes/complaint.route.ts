// routes/complaint.route.ts
import * as express from "express";
import * as complaintController from "../controllers/complaint.contoller";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", auth, complaintController.createComplaint);
router.get("/", complaintController.listComplaints);
router.get("/:id", complaintController.getComplaint);
router.put("/:id", complaintController.updateComplaint);
router.delete("/:id", complaintController.deleteComplaint);

// Additional
router.patch("/:id/stage", complaintController.updateStage);
router.patch("/:id/quote", complaintController.addQuote);
router.patch("/:id/device", complaintController.addDevice);

export default router;
