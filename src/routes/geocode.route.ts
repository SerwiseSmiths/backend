import { Router } from "express";
import { getLatLngFromAddress } from "../controllers/geocode.controller";

const router: Router = Router();

router.post("/", getLatLngFromAddress);

export default router;
