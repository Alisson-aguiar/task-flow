import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/upload.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const uploadController = new UploadController();
const upload = multer({ dest: 'uploads/' });

router.use(authMiddleware);
router.post('/upload', upload.single('file'), uploadController.uploadFile.bind(uploadController));
router.get('/files', uploadController.getFiles.bind(uploadController));

export default router;
