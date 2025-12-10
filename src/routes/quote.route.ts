import * as express from "express";
import * as quoteController from "../controllers/quote.contoller";

const router = express.Router();

router.post("/", quoteController.createQuote);
router.get("/", quoteController.getAllQuotes);
router.get("/:id", quoteController.getQuoteById);
router.patch("/:id", quoteController.updateQuote);
router.delete("/:id", quoteController.deleteQuote);

export default router;
