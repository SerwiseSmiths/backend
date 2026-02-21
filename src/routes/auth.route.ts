import * as authContoller from "../controllers/auth.controller";
import * as express from "express"
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/login", authContoller.login);
router.get("/me", auth, authContoller.me); // Protected: returns current user profile

export default router;