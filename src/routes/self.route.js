"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const selfController = require("../controllers/self.contoller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/home', auth_middleware_1.auth, selfController.home);
router.get('/address', auth_middleware_1.auth, selfController.getSelfAddress);
router.get('/devices', auth_middleware_1.auth, selfController.getSelfDevices);
router.get('/complaints', auth_middleware_1.auth, selfController.getSelfComaplints);
router.get('/wallet', auth_middleware_1.auth, selfController.getSelfWallet);
router.patch('/profile-image', auth_middleware_1.auth, selfController.updateProfileImage);
router.patch('/', auth_middleware_1.auth, selfController.updateSelfInfo);
// router.delete('/', selfController.deleteSelfAccount);
exports.default = router;
//# sourceMappingURL=self.route.js.map