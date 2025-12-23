import { Router } from 'express';
import { getEvents, createEvent, getRegistrations, registerParticipant, updateRegistration, updateEvent, deleteEvent } from '../controllers/events';

const router = Router();

router.get('/', getEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.get('/:id/registrations', getRegistrations);
router.post('/:id/register', registerParticipant);
router.put('/registrations/:regId', updateRegistration);

export default router;
