import * as express from "express";
import * as configController from "../controllers/config.controller";

const router = express.Router();

router.get("/app-version", configController.getAppVersion);

export default router;
