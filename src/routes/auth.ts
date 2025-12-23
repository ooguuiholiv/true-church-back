import { Router } from 'express';
import { login, createUser, updatePassword } from '../controllers/auth';

const router = Router();

router.post('/login', login);
router.post('/register', createUser);
router.post('/reset-password', updatePassword);

export default router;
