import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../db/db.ts';
import { Send } from '../utils/response.util.ts';

export const RoomsController = {
    async list(_req: FastifyRequest, res: FastifyReply) {
        try {
            const rooms = await prisma.rooms.findMany();
            return Send.success(res, rooms);
        } catch (_err) {
            return Send.error(res, null, 'Erro ao listar salas');
        }
    },
};
