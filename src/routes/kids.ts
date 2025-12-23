import { Router } from 'express';
import { getKids, registerKid, updateKid, getPresentKids, checkinKid, checkoutKid } from '../controllers/kids';

const router = Router();

router.get('/base', getKids); // Crianças cadastradas
router.post('/register', registerKid); // Cadastrar nova criança
router.put('/update/:id', updateKid); // Editar criança
router.get('/present', getPresentKids); // Quem está no prédio hoje
router.post('/checkin', checkinKid); // Realizar check-in de cadastrada
router.post('/checkout/:id', checkoutKid); // Realizar checkout

export default router;
