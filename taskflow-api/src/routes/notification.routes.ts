import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const notificationController = new NotificationController();

router.use(authMiddleware);
router.get('/notifications', notificationController.getUserNotifications.bind(notificationController));
router.put('/notifications/:id/read', notificationController.markAsRead.bind(notificationController));

export default router;
