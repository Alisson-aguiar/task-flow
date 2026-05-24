import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const taskController = new TaskController();

// Todas as rotas de tarefas precisam de autenticação
router.use(authMiddleware);

router.post('/tasks', taskController.createTask.bind(taskController));
router.get('/tasks', taskController.getTasks.bind(taskController));
router.get('/tasks/:id', taskController.getTaskById.bind(taskController));
router.put('/tasks/:id', taskController.updateTask.bind(taskController));
router.delete('/tasks/:id', taskController.deleteTask.bind(taskController));

export default router;
