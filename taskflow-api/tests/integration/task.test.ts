import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let authToken: string;

describe('Testes de Tarefas', () => {
  beforeAll(async () => {
    // Cria um usuário e pega o token
    const response = await request(app)
      .post('/api/v1/register')
      .send({
        name: 'Task User',
        email: 'task@example.com',
        password: 'Task123456'
      });
    
    authToken = response.body.token;
  });

  describe('POST /api/v1/tasks', () => {
    it('deve criar uma nova tarefa', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Minha primeira tarefa',
          description: 'Descrição da tarefa',
          priority: 'HIGH'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.task).toHaveProperty('title', 'Minha primeira tarefa');
    });

    it('não deve criar tarefa sem título', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Tarefa sem título'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('deve listar as tarefas do usuário', async () => {
      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.tasks).toBeInstanceOf(Array);
    });
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });
});
