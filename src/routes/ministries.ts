import { Router } from 'express';
import { getMinistries, createMinistry } from '../controllers/ministries';

const router = Router();

router.get('/', getMinistries);
router.post('/', createMinistry);

export default router;
