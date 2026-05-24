import { Router } from 'express';
import { ShareController } from '../controllers/share.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const shareController = new ShareController();

// Todas as rotas de compartilhamento precisam de autenticação
router.use(authMiddleware);

// Rotas de compartilhamento
router.post('/tasks/:id/share', shareController.shareTask.bind(shareController));
router.get('/shared-with-me', shareController.getSharedWithMe.bind(shareController));
router.delete('/tasks/:taskId/share/:email', shareController.removeShare.bind(shareController));

export default router;
