import * as express from "express";
import * as configController from "../controllers/config.controller";

const router = express.Router();

router.get("/app-version", configController.getAppVersion);
router.get("/serwise", configController.getSerwiseConfig);
router.get("/radix", configController.getRadixConfig);

export default router;
