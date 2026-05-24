import logger from '../config/logger';

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err: any, req: any, res: any, next: any) => {
    logger.error(err.stack);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            timestamp: new Date().toISOString(),
        });
    }

    // Erro do Prisma
    if (err.code === 'P2002') {
        return res.status(409).json({
            success: false,
            message: 'Registro duplicado',
            field: err.meta?.target,
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
    });
};