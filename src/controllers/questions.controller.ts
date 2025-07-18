import type { FastifyReply, FastifyRequest } from 'fastify';
import type z from 'zod';
import { prisma } from '../db/db.ts';
import {
    generateAnswer,
    generateEmbeddings,
} from '../services/gemini.service.ts';
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

            const embeddings = await generateEmbeddings(question);
            const embeddingsAsString = `[${embeddings.join(',')}]`;

            const chunks = (await prisma.$queryRaw`
                SELECT 
                    id,
                    transcription,
                    1 - (embeddings <=> ${embeddingsAsString}::vector) as similarity
                FROM audio_chunks
                WHERE "roomId" = ${roomId}
                ORDER BY embeddings <=> ${embeddingsAsString}::vector
                LIMIT 3
            `) as Array<{
                id: string;
                transcription: string;
                similarity: number;
            }>;

            let answer: string | null = null;

            if (chunks.length > 0) {
                const transcriptions = chunks.map((chunk) => chunk.transcription);
                answer = await generateAnswer(question, transcriptions);
            }

            const newQuestion = await prisma.questions.create({
                data: {
                    roomId,
                    question,
                    answer,
                },
                select: {
                    id: true,
                    question: true,
                    answer: true,
                    createdAt: true,
                },
            });

            return Send.success(
                res,
                {
                    questionId: newQuestion.id,
                    answer: newQuestion.answer,
                },
                'Pergunta criada com sucesso!'
            );
        } catch (_err) {
            return Send.error(res, null, 'Falha ao criar nova sala.');
        }
    },
};
