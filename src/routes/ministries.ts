import { Router } from 'express';
import { getMinistries, createMinistry } from '../controllers/ministries';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getMinistries);
router.post('/', createMinistry);

export default router;
