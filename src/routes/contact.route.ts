import * as express from "express";
import { auth } from "../middlewares/auth.middleware";
import * as contactController from "../controllers/contact.controller";

const router = express.Router();

// POST /contacts/sync  — upload/replace all device contacts for the logged-in user
router.post("/sync", auth, contactController.syncContacts);

// GET  /contacts       — fetch the stored contacts for the logged-in user
router.get("/", auth, contactController.getContacts);

export default router;
