import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationController {
  // Criar notificação
  async createNotification(userId: string, title: string, message: string, type: string) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        read: false
      }
    });
    return notification;
  }

  // Buscar notificações do usuário
  async getUserNotifications(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user.userId;
      
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      
      const unreadCount = notifications.filter(n => !n.read).length;
      
      return res.json({ notifications, unreadCount });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar notificações' });
    }
  }

  // Marcar como lida
  async markAsRead(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;
      
      await prisma.notification.updateMany({
        where: { id, userId },
        data: { read: true }
      });
      
      return res.json({ message: 'Notificação marcada como lida' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao marcar notificação' });
    }
  }
}
