import { Router } from "express";
import * as controller from "../controllers/device.controller";

const router: Router = Router();

router.post("/", controller.createDevice);
router.get("/", controller.getDevices);
router.get("/user/:userId", controller.getUserDevices);
router.get("/:id", controller.getDevice);
router.put("/:id", controller.updateDevice);
router.delete("/:id", controller.deleteDevice);

export default router;
