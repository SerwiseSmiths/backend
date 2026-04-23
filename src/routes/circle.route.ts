import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import * as circleController from "../controllers/circle.controller";

const router: Router = Router();

router.use(auth);

router.post("/create", circleController.createCircle);
router.post("/join", circleController.joinCircleByLink);
router.post("/promote", circleController.promoteToAdmin);
router.get("/mutual-circles", circleController.getMutualCircles);

export default router;
