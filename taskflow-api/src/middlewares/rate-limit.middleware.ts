import rateLimit from 'express-rate-limit';

// Limite mais rigoroso para login (evita brute force)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: {
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite para criação de tarefas
export const taskCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // máximo 50 tarefas por hora
  message: {
    message: 'Limite de criação de tarefas atingido. Aguarde 1 hora.'
  },
});
