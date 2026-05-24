import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'Token não fornecido' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Token mal formatado' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
      name: string;
    };
    
    (req as any).user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expirado' });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Token inválido' });
      return;
    }
    res.status(500).json({ message: 'Erro ao autenticar' });
    return;
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if ((req as any).user?.role !== 'ADMIN') {
    res.status(403).json({ message: 'Acesso negado. Requer privilégios de admin.' });
    return;
  }
  next();
};
