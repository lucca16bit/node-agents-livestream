import type { FastifyInstance } from 'fastify';
import { RoomsController } from '../controllers/rooms.controller.ts';

export function roomsRoutes(app: FastifyInstance) {
    app.get('/rooms', RoomsController.list);
}
