import type { FastifyReply } from 'fastify';

export const Send = {
    success(res: FastifyReply, data: unknown, message?: string): FastifyReply {
        return res.status(200).send({ success: true, message, data });
    },

    error(res: FastifyReply, data: unknown, message: string): FastifyReply {
        return res.status(500).send({ success: false, message, data });
    },

    notFound(res: FastifyReply, data: unknown, message: string): FastifyReply {
        return res.status(404).send({ success: false, message, data });
    },

    unauthorized(res: FastifyReply, data: unknown, message: string): FastifyReply {
        return res.status(401).send({ success: false, message, data });
    }
};
