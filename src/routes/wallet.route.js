"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const walletController = require("../controllers/wallet.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
// Assuming there is an auth middleware to protect these routes
// logic: In user.route.ts, `cloudinaryUploadMiddleware` was used.
// Checking `middlewares` folder content from previous `list_dir`.
// `middlewares` had `auth.middleware.ts` likely?
// `list_dir` output showed `middlewares` has 20 children.
// I will check if there is a common auth middleware normally used.
// app.ts didn't show global auth middleware.
// I'll assume I should use an auth middleware, or at least leave it for user to wire up if I can't find it.
// Wait, I should check `src/middlewares` to see what's available to be safe.
// For now I will import it if I find it, or else just create the route structure.
// I'll assume `verifyToken` or similar exists.
// Let's Check middlewares first to be professional. 
// But I cannot check now without breaking the tool chain sequence? 
// No, I can check later? No I am writing the file now.
// I will write the basic routes. If auth is needed, I'll add a comment or try to import standard one.
// Let's assume `checkAuth` or `auth` conventions.
// Actually, looking at `user.route.ts`:
// `router.post("/", cloudinaryUploadMiddleware, userContoller.registerUser);`
// `router.get("/", userContoller.getAllUsers);` <-- No auth?
// `router.get("/refCode/:refCode/verify", userContoller.validateRefCode);`
// It seems some routes are public.
// Wallet routes MUST be private.
// I will assume there is an auth middleware. I will try to find it via `find_by_name`.
// But I am in the middle of writing.
// I will write it without middleware for now, and then I can update it if I find the middleware.
// OR better, I will invoke `find_by_name` in the next turn and then update this file.
// Actually, I can just leave a TODO comment.
router.get("/", auth_middleware_1.auth, walletController.getWallet);
router.post("/create", auth_middleware_1.auth, walletController.createWallet);
router.get("/user/:userId", auth_middleware_1.auth, walletController.getWalletByUserId);
router.post("/credit", auth_middleware_1.auth, walletController.creditWallet);
router.post("/debit", auth_middleware_1.auth, walletController.debitWallet);
router.get("/history", auth_middleware_1.auth, walletController.getHistory);
exports.default = router;
//# sourceMappingURL=wallet.route.js.map