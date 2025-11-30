import * as express from "express";
import * as addressController from "../controllers/address.controller";
import {auth} from "../middlewares/auth.middleware"

const router: express.Router = express.Router();

// CRUD Routes
router.post("/", auth, addressController.createAddress);

router.get("/", auth, addressController.getUserAddresses);

router.get("/:id", addressController.getAddress);

router.put("/:id", addressController.updateAddress);

router.delete("/:id", addressController.deleteAddress);

export default router;
