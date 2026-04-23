import { Router } from "express";
import * as quoteController from "../controllers/quote.contoller";

const router: Router = Router();

router.post("/", quoteController.createQuote);
router.get("/", quoteController.getAllQuotes);
router.get("/:id", quoteController.getQuoteById);
router.patch("/:id", quoteController.updateQuote);
router.patch("/:id/status", quoteController.updateQuoteStatus);
router.delete("/:id", quoteController.deleteQuote);

export default router;
