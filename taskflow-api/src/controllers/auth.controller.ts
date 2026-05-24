import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      let { name, email, password } = req.body;

      const userExists = await prisma.user.findUnique({
        where: { email }
      });

      if (userExists) {
        return res.status(400).json({ message: 'Usuário já existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      });

      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          name: user.name
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ message: 'Email ou senha inválidos' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Email ou senha inválidos' });
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          name: user.name
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      const { password: _, ...userWithoutPassword } = user;

      return res.json({
        message: 'Login realizado com sucesso',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao fazer login' });
    }
  }

  async verifyToken(req: Request, res: Response): Promise<Response> {
    try {
      return res.json({ 
        message: 'Token válido',
        user: (req as any).user 
      });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao verificar token' });
    }
  }
}
