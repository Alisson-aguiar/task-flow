import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { io } from '../server';

const prisma = new PrismaClient();

export class ShareController {
  async shareTask(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { email, permission } = req.body;
      const userId = (req as any).user.userId;
      const userName = (req as any).user.name;

      console.log('Usuario:', { userId, userName });

      const task = await prisma.task.findFirst({
        where: { id, userId }
      });

      if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }

      const userToShare = await prisma.user.findUnique({
        where: { email }
      });

      if (!userToShare) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      if (userToShare.id === userId) {
        return res.status(400).json({ message: 'Não é possível compartilhar com você mesmo' });
      }

      const shared = await prisma.sharedTask.upsert({
        where: {
          taskId_sharedWith: {
            taskId: id,
            sharedWith: email
          }
        },
        update: { permission },
        create: {
          taskId: id,
          sharedBy: userId,
          sharedWith: email,
          permission
        }
      });

      const notification = await prisma.notification.create({
        data: {
          userId: userToShare.id,
          title: 'Nova tarefa compartilhada',
          message: `${userName || 'Usuario'} compartilhou a tarefa "${task.title}" com você`,
          type: 'TASK_SHARED',
          read: false
        }
      });

      if (io) {
        io.emit(`notification-${userToShare.id}`, {
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          createdAt: notification.createdAt
        });
      }

      return res.status(200).json({ 
        message: 'Tarefa compartilhada com sucesso', 
        shared,
        notification
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      return res.status(500).json({ message: 'Erro ao compartilhar tarefa' });
    }
  }

  async getSharedWithMe(req: Request, res: Response): Promise<Response> {
    try {
      const userEmail = (req as any).user.email;

      const sharedTasks = await prisma.sharedTask.findMany({
        where: { sharedWith: userEmail },
        include: {
          task: {
            include: {
              user: {
                select: { name: true, email: true }
              }
            }
          }
        }
      });

      return res.json({ sharedTasks });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar tarefas compartilhadas' });
    }
  }

  async removeShare(req: Request, res: Response): Promise<Response> {
    try {
      const { taskId, email } = req.params;
      const userId = (req as any).user.userId;

      await prisma.sharedTask.deleteMany({
        where: {
          taskId,
          sharedWith: email,
          task: { userId }
        }
      });

      return res.json({ message: 'Compartilhamento removido' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao remover compartilhamento' });
    }
  }
}
