import { Router } from 'express';
import { register, login, generateOTP, verifyOTP, resetPassword } from '../controllers/appController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/generateOTP', generateOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/resetPassword', resetPassword);

export default router;
