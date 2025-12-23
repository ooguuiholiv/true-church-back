import { Router } from 'express';
import { getDocuments, createDocument, deleteDocument, upload, globalSearch, getSmartNotifications } from '../controllers/secretary';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);

router.get('/documents', getDocuments);
router.post('/documents', upload.single('file'), createDocument);
router.delete('/documents/:id', deleteDocument);

router.get('/search', globalSearch);
router.get('/notifications', getSmartNotifications);

export default router;
