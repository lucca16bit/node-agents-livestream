import type { FastifyInstance } from 'fastify';
import { QuestionsController } from '../controllers/questions.controller.ts';

export function questionsRoutes(app: FastifyInstance) {
    app.get('/rooms/:roomId/questions', QuestionsController.list);
    app.post('/rooms/:roomId/questions', QuestionsController.create);
}
