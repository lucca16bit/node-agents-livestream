import type { FastifyReply, FastifyRequest } from 'fastify';
import type z from 'zod';
import { prisma } from '../db/db.ts';
import { Send } from '../utils/response.util.ts';
import type { roomSchema } from '../validations/room.schema.ts';

export const RoomsController = {
    async list(_req: FastifyRequest, res: FastifyReply) {
        try {
            const rooms = await prisma.rooms.findMany({
                include: {
                    _count: {
                        select: { questions: true },
                    },
                },
            });

            const roomsWithQuestionCount = rooms.map((room) => ({
                id: room.id,
                name: room.name,
                description: room.description,
                createdAt: room.createdAt,
                questions: room._count.questions,
            }));

            return Send.success(res, roomsWithQuestionCount);
        } catch (_err) {
            return Send.error(res, null, 'Erro ao listar salas');
        }
    },

    async create(req: FastifyRequest, res: FastifyReply) {
        const { name, description } = req.body as z.infer<
            typeof roomSchema.createRoomSchema
        >;

        try {
            const roomExists = await prisma.rooms.findFirst({
                where: { name },
            });

            if (roomExists) {
                return Send.error(res, null, 'A sala já existe.');
            }

            const newRoom = await prisma.rooms.create({
                data: {
                    name,
                    description,
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                },
            });

            return Send.success(res, newRoom, 'Sala criada com sucesso!');
        } catch (_err) {
            return Send.error(res, null, 'Falha ao criar nova sala.');
        }
    },
};
