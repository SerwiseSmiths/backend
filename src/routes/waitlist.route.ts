import * as express from "express";
import * as WaitlistController from "../controllers/waitlist.controller";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

// Public — anyone can join
router.post("/join", WaitlistController.joinWaitlist);

// Admin only — requires auth
router.get("/", auth, WaitlistController.getWaitlist);

export default router;
