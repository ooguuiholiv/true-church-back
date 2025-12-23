import { Router } from 'express';
import { getMembers, createMember, updateMember, deleteMember, memberUpload } from '../controllers/members';

const router = Router();

router.get('/', getMembers);
router.post('/', memberUpload.single('photoFile'), createMember);
router.put('/:id', memberUpload.single('photoFile'), updateMember);
router.delete('/:id', deleteMember);

export default router;
