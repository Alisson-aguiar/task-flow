import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const commentController = new CommentController();

router.use(authMiddleware);
router.post('/tasks/:taskId/comments', commentController.createComment.bind(commentController));
router.get('/tasks/:taskId/comments', commentController.getTaskComments.bind(commentController));
router.delete('/comments/:commentId', commentController.deleteComment.bind(commentController));

export default router;
