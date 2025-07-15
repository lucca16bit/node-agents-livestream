import type { FastifyInstance } from 'fastify';
import { audioRoutes } from './audio.routes.ts';
import { questionsRoutes } from './questions.routes.ts';
import { roomsRoutes } from './rooms.routes.ts';

export function router(app: FastifyInstance) {
    app.register(roomsRoutes, { prefix: '/api' });
    app.register(questionsRoutes, { prefix: '/api' });
    app.register(audioRoutes, { prefix: '/api' });
}
