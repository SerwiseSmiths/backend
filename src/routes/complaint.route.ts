import { Router } from "express";
import { ComplaintController } from "../controllers/complaint.contoller";

const router = Router();

router.get("/", ComplaintController.getAll);
router.get("/:id", ComplaintController.getOne);
router.post("/", ComplaintController.create);
router.put("/:id", ComplaintController.update);
router.delete("/:id", ComplaintController.delete);

export default router;
