import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import * as chatController from "../controllers/chat.controller";

const router: Router = Router();

router.use(auth);

router.get("/history", chatController.getChatHistory);
router.post("/share-complaint", chatController.shareComplaint);
router.post("/username", chatController.updateUsername);
router.get("/mutual-friends", chatController.getMutualFriends);

export default router;
