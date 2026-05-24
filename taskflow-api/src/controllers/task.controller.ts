import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TaskController {
  // CREATE - Criar nova tarefa
  async createTask(req: Request, res: Response): Promise<Response> {
    try {
      const { title, description, priority, dueDate } = req.body;
      const userId = (req as any).user.userId;

      const task = await prisma.task.create({
        data: {
          title,
          description,
          priority: priority || 'MEDIUM',
          dueDate: dueDate ? new Date(dueDate) : null,
          userId
        }
      });

      return res.status(201).json({
        message: 'Tarefa criada com sucesso',
        task
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao criar tarefa' });
    }
  }

  // READ - Listar todas as tarefas do usuário
  async getTasks(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user.userId;
      const { status, priority, page = 1, limit = 10 } = req.query;

      const where: any = { userId };
      
      if (status) where.status = status as string;
      if (priority) where.priority = priority as string;

      const tasks = await prisma.task.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      });

      const total = await prisma.task.count({ where });

      return res.json({
        tasks,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar tarefas' });
    }
  }

  // READ - Buscar uma tarefa específica
  async getTaskById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const task = await prisma.task.findFirst({
        where: { id, userId }
      });

      if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }

      return res.json(task);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar tarefa' });
    }
  }

  // UPDATE - Atualizar tarefa
  async updateTask(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;
      const { title, description, status, priority, dueDate } = req.body;

      // Verifica se a tarefa existe e pertence ao usuário
      const existingTask = await prisma.task.findFirst({
        where: { id, userId }
      });

      if (!existingTask) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }

      const task = await prisma.task.update({
        where: { id },
        data: {
          title,
          description,
          status,
          priority,
          dueDate: dueDate ? new Date(dueDate) : undefined
        }
      });

      return res.json({
        message: 'Tarefa atualizada com sucesso',
        task
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar tarefa' });
    }
  }

  // DELETE - Deletar tarefa
  async deleteTask(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const existingTask = await prisma.task.findFirst({
        where: { id, userId }
      });

      if (!existingTask) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }

      await prisma.task.delete({ where: { id } });

      return res.json({ message: 'Tarefa deletada com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao deletar tarefa' });
    }
  }
}
