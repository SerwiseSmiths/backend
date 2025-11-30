import { Router } from "express";
import { getLatLngFromAddress } from "../controllers/geocode.controller";

const router = Router();

router.post("/", getLatLngFromAddress);

export default router;
