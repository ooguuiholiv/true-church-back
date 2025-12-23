import { Router } from 'express';
import { getMembers, createMember, updateMember, deleteMember, memberUpload } from '../controllers/members';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getMembers);
router.post('/', memberUpload.single('photoFile'), createMember);
router.put('/:id', memberUpload.single('photoFile'), updateMember);
router.delete('/:id', deleteMember);

export default router;
