import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
            message: 'Erro de validação'
        });
    }
    next();
};

export const rateLimitMiddleware = require('express-rate-limit')({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Muitas requisições, tente novamente mais tarde',
    standardHeaders: true,
    legacyHeaders: false,
});