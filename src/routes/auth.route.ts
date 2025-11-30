import * as authContoller from "../controllers/auth.controller";
import * as express from "express"
const router = express.Router();

router.post("/login", authContoller.login);

export default router;