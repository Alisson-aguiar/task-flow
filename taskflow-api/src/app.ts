import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import session from 'express-session';
import logger from './config/logger';
import path from 'path';

// Importar rotas
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import notificationRoutes from './routes/notification.routes';
import uploadRoutes from './routes/upload.routes';
import shareRoutes from './routes/share.routes';
import profileRoutes from './routes/profile.routes';
import commentRoutes from './routes/comment.routes';
import socialAuthRoutes from './routes/social-auth.routes';

import passport from './config/passport';

const app: Application = express();

// Configuração CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3333'],
  credentials: true,
}));

// Session (obrigatório para passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'taskflow-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Configurações básicas (sem auth)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logging
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Rate limiting (sem auth)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições, tente novamente mais tarde.'
});
app.use('/api', limiter);

// Swagger
const swaggerDocs = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'TaskFlow API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3333' }]
  },
  apis: ['./src/routes/*.ts']
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ============================================
// ROTAS SOCIAIS (NÃO TÊM AUTH)
// ============================================
app.use('/api/v1', socialAuthRoutes);

// ============================================
// ROTAS QUE PRECISAM DE AUTH
// ============================================
app.use('/api/v1', authRoutes);
app.use('/api/v1', taskRoutes);
app.use('/api/v1', notificationRoutes);
app.use('/api/v1', uploadRoutes);
app.use('/api/v1', shareRoutes);
app.use('/api/v1', profileRoutes);
app.use('/api/v1', commentRoutes);

// Rota de saúde (sem auth)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API', version: '1.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada', path: req.path });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Erro interno', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

export default app;
