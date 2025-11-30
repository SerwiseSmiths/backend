import { Router } from "express";
import { QuoteController } from "../controllers/quote.contoller";

const router = Router();

router.get("/", QuoteController.getAll);
router.get("/:id", QuoteController.getOne);
router.post("/", QuoteController.create);
router.put("/:id", QuoteController.update);
router.delete("/:id", QuoteController.delete);

export default router;
