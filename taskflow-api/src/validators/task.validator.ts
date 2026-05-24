import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateTask = [
  body('title')
    .notEmpty().withMessage('Título é obrigatório')
    .isLength({ min: 3, max: 100 }).withMessage('Título deve ter entre 3 e 100 caracteres'),
  
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Descrição deve ter no máximo 500 caracteres'),
  
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Prioridade inválida. Use: LOW, MEDIUM, HIGH, URGENT'),
  
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).withMessage('Status inválido. Use: PENDING, IN_PROGRESS, COMPLETED, CANCELLED'),
  
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Data deve estar no formato ISO 8601')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Data de vencimento não pode ser no passado');
      }
      return true;
    }),
  
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
