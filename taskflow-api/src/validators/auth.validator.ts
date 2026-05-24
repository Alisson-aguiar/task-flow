import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validações para registro
export const validateRegister = [
  body('name')
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres')
    .trim(),
  
  body('email')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
    .matches(/[A-Z]/).withMessage('Senha deve conter pelo menos uma letra maiúscula')
    .matches(/[0-9]/).withMessage('Senha deve conter pelo menos um número'),
  
  // Middleware para verificar erros
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Erro de validação',
        errors: errors.array() 
      });
    }
    next();
  }
];

// Validações para login
export const validateLogin = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Erro de validação',
        errors: errors.array() 
      });
    }
    next();
  }
];
