import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
    // Setup test database
    console.log('Setting up test environment...');
});

afterAll(async () => {
    await prisma.$disconnect();
    console.log('Test environment cleaned up...');
});