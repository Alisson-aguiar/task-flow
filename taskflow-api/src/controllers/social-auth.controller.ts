import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

export class SocialAuthController {
  // Iniciar autenticação Google
  googleAuth(req: Request, res: Response) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  }

  // Callback do Google
  googleCallback(req: Request, res: Response) {
    passport.authenticate('google', { session: false }, (err: any, user: any) => {
      if (err || !user) {
        console.error('Erro Google:', err);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
      }
      
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );
      
      console.log('Login Google bem-sucedido:', user.email);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
    })(req, res);
  }

  // Iniciar autenticação GitHub
  githubAuth(req: Request, res: Response) {
    passport.authenticate('github', { scope: ['user:email'] })(req, res);
  }

  // Callback do GitHub
  githubCallback(req: Request, res: Response) {
    passport.authenticate('github', { session: false }, (err: any, user: any) => {
      if (err || !user) {
        console.error('Erro GitHub:', err);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
      }
      
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );
      
      console.log('Login GitHub bem-sucedido:', user.email);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
    })(req, res);
  }
}
