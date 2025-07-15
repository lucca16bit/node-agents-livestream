import type { FastifyInstance } from 'fastify';
import { AudioController } from '../controllers/audio.controller.ts';

export function audioRoutes(app: FastifyInstance) {
    app.post('/rooms/:roomId/audio', AudioController.create);
}
