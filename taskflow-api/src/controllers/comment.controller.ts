import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { io } from '../server';

const prisma = new PrismaClient();

export class CommentController {
  // Criar comentário
  async createComment(req: Request, res: Response): Promise<Response> {
    try {
      const { taskId } = req.params;
      const { content } = req.body;
      const userId = (req as any).user.userId;
      const userName = (req as any).user.name;

      if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Comentário não pode estar vazio' });
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          taskId,
          userId
        },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      // Emitir notificação via Socket.IO
      io.emit(`task-${taskId}-comment`, {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          name: comment.user.name
        }
      });

      return res.status(201).json({ message: 'Comentário adicionado', comment });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao adicionar comentário' });
    }
  }

  // Listar comentários de uma tarefa
  async getTaskComments(req: Request, res: Response): Promise<Response> {
    try {
      const { taskId } = req.params;

      const comments = await prisma.comment.findMany({
        where: { taskId },
        include: {
          user: {
            select: { id: true, name: true, email: true, profile: { select: { avatar: true } } }
          }
        },
        orderBy: { createdAt: 'asc' }
      });

      return res.json({ comments });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar comentários' });
    }
  }

  // Deletar comentário
  async deleteComment(req: Request, res: Response): Promise<Response> {
    try {
      const { commentId } = req.params;
      const userId = (req as any).user.userId;

      const comment = await prisma.comment.findFirst({
        where: { id: commentId, userId }
      });

      if (!comment) {
        return res.status(404).json({ message: 'Comentário não encontrado' });
      }

      await prisma.comment.delete({ where: { id: commentId } });

      return res.json({ message: 'Comentário removido' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao deletar comentário' });
    }
  }
}
