import * as authContoller from "../controllers/auth.controller";
import * as express from "express"
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/login", authContoller.login);
router.post("/otp/generate", authContoller.generateOtp);
router.post("/otp/verify", authContoller.verifyOtp);
router.post("/truecaller/verify", authContoller.truecallerAuth);
router.post("/truecaller/oauth", authContoller.truecallerOAuthAuth);
router.post("/refresh", authContoller.refreshToken);
router.get("/me", auth, authContoller.me); // Protected: returns current user profile

export default router;
