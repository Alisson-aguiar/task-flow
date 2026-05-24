import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Garantir que a pasta de uploads existe
const uploadDir = './uploads/avatars';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar upload de avatar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = (req as any).user?.userId;
    const ext = path.extname(file.originalname);
    const allowedExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const finalExt = allowedExt.includes(ext.toLowerCase()) ? ext : '.jpg';
    cb(null, `${userId}-${Date.now()}${finalExt}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Use: JPG, PNG, GIF, WEBP'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export class ProfileController {
  // Obter perfil do usuário
  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      return res.json({ user });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return res.status(500).json({ message: 'Erro ao buscar perfil' });
    }
  }

  // Atualizar perfil (nome, bio, telefone)
  async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user.userId;
      const { name, bio, phone } = req.body;

      // Atualizar usuário
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name }
      });

      // Atualizar ou criar perfil
      const profile = await prisma.profile.upsert({
        where: { userId },
        update: { bio, phone },
        create: { userId, bio, phone }
      });

      return res.json({
        message: 'Perfil atualizado com sucesso',
        user: updatedUser,
        profile
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return res.status(500).json({ message: 'Erro ao atualizar perfil' });
    }
  }

  // Alterar senha
  async changePassword(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user.userId;
      const { currentPassword, newPassword } = req.body;

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Verificar senha atual
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Senha atual incorreta' });
      }

      // Validar nova senha
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Nova senha deve ter pelo menos 6 caracteres' });
      }

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Atualizar senha
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      return res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return res.status(500).json({ message: 'Erro ao alterar senha' });
    }
  }

  // Upload de avatar
  async uploadAvatar(req: Request, res: Response): Promise<Response> {
    try {
      const uploadSingle = upload.single('avatar');

      return new Promise((resolve, reject) => {
        uploadSingle(req, res, async (err: any) => {
          if (err) {
            console.error('Erro no upload:', err);
            return resolve(res.status(400).json({ message: err.message }));
          }

          const file = req.file;
          if (!file) {
            return resolve(res.status(400).json({ message: 'Nenhum arquivo enviado' }));
          }

          const userId = (req as any).user.userId;
          const avatarUrl = `/uploads/avatars/${file.filename}`;

          try {
            // Atualizar perfil com o avatar
            const profile = await prisma.profile.upsert({
              where: { userId },
              update: { avatar: avatarUrl },
              create: { userId, avatar: avatarUrl }
            });

            resolve(res.json({
              message: 'Avatar atualizado com sucesso',
              avatar: avatarUrl,
              profile
            }));
          } catch (dbError) {
            console.error('Erro ao salvar no banco:', dbError);
            resolve(res.status(500).json({ message: 'Erro ao salvar avatar no banco' }));
          }
        });
      });
    } catch (error) {
      console.error('Erro no uploadAvatar:', error);
      return res.status(500).json({ message: 'Erro ao enviar avatar' });
    }
  }
}
