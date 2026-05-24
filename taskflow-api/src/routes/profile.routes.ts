import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const profileController = new ProfileController();

router.use(authMiddleware);
router.get('/profile', profileController.getProfile.bind(profileController));
router.put('/profile', profileController.updateProfile.bind(profileController));
router.put('/profile/change-password', profileController.changePassword.bind(profileController));
router.post('/profile/avatar', profileController.uploadAvatar.bind(profileController));

export default router;
