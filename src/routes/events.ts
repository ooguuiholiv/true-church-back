import { Router } from 'express';
import { getEvents, createEvent, getRegistrations, registerParticipant, updateRegistration, updateEvent, deleteEvent } from '../controllers/events';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Public routes for the landing page
router.get('/', getEvents);
router.post('/:id/register', registerParticipant);

// Management routes protected by token
router.post('/', authenticateToken, createEvent);
router.put('/:id', authenticateToken, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);
router.get('/:id/registrations', authenticateToken, getRegistrations);
router.put('/registrations/:regId', authenticateToken, updateRegistration);

export default router;
