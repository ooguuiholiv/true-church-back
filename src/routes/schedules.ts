import { Router } from 'express';
import { getSchedules, createSchedule, updateSchedule } from '../controllers/schedules';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getSchedules);
router.post('/', createSchedule);
router.put('/:id', updateSchedule);

export default router;
