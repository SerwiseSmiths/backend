import * as express from "express";
import * as serviceController from "../controllers/service.contoller";

const router = express.Router();

router.post("/", serviceController.createService);
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);
router.patch("/:id", serviceController.updateService);
router.delete("/:id", serviceController.deleteService);

export default router;
