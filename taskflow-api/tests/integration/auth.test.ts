import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Testes de Autenticação', () => {
  // Limpa o banco antes dos testes
  beforeAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /api/v1/register', () => {
    it('deve registrar um novo usuário', async () => {
      const response = await request(app)
        .post('/api/v1/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test123456'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('não deve registrar usuário com email já existente', async () => {
      const response = await request(app)
        .post('/api/v1/register')
        .send({
          name: 'Test User 2',
          email: 'test@example.com',
          password: 'Test123456'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Usuário já existe');
    });
  });

  describe('POST /api/v1/login', () => {
    it('deve fazer login com credenciais corretas', async () => {
      const response = await request(app)
        .post('/api/v1/login')
        .send({
          email: 'test@example.com',
          password: 'Test123456'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('não deve fazer login com senha incorreta', async () => {
      const response = await request(app)
        .post('/api/v1/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Email ou senha inválidos');
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
