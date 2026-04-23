import { Router } from 'express';
import * as selfController from '../controllers/self.contoller';
import { auth } from '../middlewares/auth.middleware';

const router: Router = Router();

router.get('/home', auth, selfController.home);
router.get('/address', auth, selfController.getSelfAddress);
router.get('/devices', auth, selfController.getSelfDevices);
router.get('/complaints', auth, selfController.getSelfComaplints);
router.get('/wallet', auth, selfController.getSelfWallet);
router.patch('/profile-image', auth, selfController.updateProfileImage);
router.patch('/', auth, selfController.updateSelfInfo);
// router.delete('/', selfController.deleteSelfAccount);

export default router;  