import * as Express from 'express';
import * as selfController from '../controllers/self.contoller';
import { auth } from '../middlewares/auth.middleware';

const router = Express.Router();

router.get('/home',auth, selfController.home);
router.get('/address',auth, selfController.getSelfAddress);
router.get('/devices',auth, selfController.getSelfDevices);
router.get('/complaints',auth, selfController.getSelfComaplints);
// router.patch('/', selfController.updateSelfInfo);
// router.delete('/', selfController.deleteSelfAccount);

export default router;  