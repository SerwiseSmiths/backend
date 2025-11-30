import * as express from "express";
import * as controller from "../controllers/deviceType.contoller";

const router: express.Router = express.Router();

router.post("/", controller.createDeviceType);
router.get("/", controller.getDeviceTypes);
router.get("/:id", controller.getDeviceType);
router.put("/:id", controller.updateDeviceType);
router.delete("/:id", controller.deleteDeviceType);

export default router;
