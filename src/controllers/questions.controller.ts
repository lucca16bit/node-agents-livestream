import type { FastifyReply, FastifyRequest } from 'fastify';
import type z from 'zod';
import { prisma } from '../db/db.ts';
import { Send } from '../utils/response.util.ts';
import { questionSchema } from '../validations/question.schema.ts';

export const QuestionsController = {
    async list(req: FastifyRequest, res: FastifyReply) {
        const { roomId } = questionSchema.roomIdExistsSchema.parse(req.params);

        try {
            const roomExists = await prisma.rooms.findUnique({
                where: { id: roomId },
            });

            if (!roomExists) {
                return Send.notFound(res, null, 'A sala não existe.');
            }

            const questions = await prisma.questions.findMany({
                where: { roomId },
                select: {
                    id: true,
                    question: true,
                    answer: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return Send.success(res, questions);
        } catch (_err) {
            return Send.error(res, null, 'Erro ao visualizar a pergunta.');
        }
    },
    async create(req: FastifyRequest, res: FastifyReply) {
        const { question } = req.body as z.infer<
            typeof questionSchema.createQuestionSchema
        >;
        const { roomId } = questionSchema.roomIdExistsSchema.parse(req.params);

        try {
            const roomExists = await prisma.rooms.findUnique({
                where: { id: roomId },
            });

            if (!roomExists) {
                return Send.notFound(res, null, 'A sala não existe.');
            }

            const newQuestion = await prisma.questions.create({
                data: {
                    roomId,
                    question,
                },
                select: {
                    id: true,
                    question: true,
                    createdAt: true,
                },
            });

            return Send.success(res, newQuestion, 'Pergunta criada com sucesso!');
        } catch (_err) {
            return Send.error(res, null, 'Falha ao criar nova sala.');
        }
    },
};
