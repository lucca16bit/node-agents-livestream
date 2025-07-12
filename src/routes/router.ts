import type { FastifyInstance } from 'fastify';
import { roomsRoutes } from './rooms.routes.ts';

export function router(app: FastifyInstance) {
    app.register(roomsRoutes, { prefix: '/api' });
}
