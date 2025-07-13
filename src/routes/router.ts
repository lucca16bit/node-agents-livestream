import type { FastifyInstance } from 'fastify';
import { questionsRoutes } from './questions.routes.ts';
import { roomsRoutes } from './rooms.routes.ts';

export function router(app: FastifyInstance) {
    app.register(roomsRoutes, { prefix: '/api' });
    app.register(questionsRoutes, { prefix: '/api' });
}
