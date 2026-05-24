import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

// Google
router.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login?error=google_failed' }),
  (req, res) => {
    try {
      const user = req.user as any;
      console.log('Callback Google - Usuário:', user?.email);
      
      if (!user) {
        console.log('Usuário não encontrado no callback');
        return res.redirect('http://localhost:5173/login?error=no_user');
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
      
      console.log('Token gerado para:', user.email);
      console.log('Redirecionando para frontend com token');
      res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Erro no callback Google:', error);
      res.redirect('http://localhost:5173/login?error=callback_error');
    }
  }
);

// GitHub
router.get('/auth/github', 
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/auth/github/callback', 
  passport.authenticate('github', { session: false, failureRedirect: 'http://localhost:5173/login?error=github_failed' }),
  (req, res) => {
    try {
      const user = req.user as any;
      console.log('Callback GitHub - Usuário:', user?.email);
      
      if (!user) {
        console.log('Usuário não encontrado no callback');
        return res.redirect('http://localhost:5173/login?error=no_user');
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
      
      console.log('Token gerado para:', user.email);
      res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Erro no callback GitHub:', error);
      res.redirect('http://localhost:5173/login?error=callback_error');
    }
  }
);

// Rota de teste
router.get('/auth/test', (req, res) => {
  res.json({ message: 'Rota social funcionando!' });
});

export default router;
