import { Request, Response } from 'express';
import os from 'os';

export class HealthController {
    async check(req: Request, res: Response) {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                total: os.totalmem() / 1024 / 1024 / 1024,
                free: os.freemem() / 1024 / 1024 / 1024,
                usage: process.memoryUsage(),
            },
            cpu: os.cpus().length,
            environment: process.env.NODE_ENV,
            version: process.env.npm_package_version,
        };

        res.json(health);
    }

    async readiness(req: Request, res: Response) {
        // Verificar DB, Redis, etc
        res.json({ status: 'ready' });
    }

    async liveness(req: Request, res: Response) {
        res.json({ status: 'alive' });
    }
}