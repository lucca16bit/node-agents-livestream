import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../db/db.ts';
import {
    generateEmbeddings,
    transcribeAudio,
} from '../services/gemini.service.ts';
import { Send } from '../utils/response.util.ts';
import { roomSchema } from '../validations/room.schema.ts';

export const AudioController = {
    async create(req: FastifyRequest, res: FastifyReply) {
        const { roomId } = roomSchema.roomIdExistsSchema.parse(req.params);

        try {
            const roomExists = await prisma.rooms.findUnique({
                where: { id: roomId },
            });

            if (!roomExists) {
                return Send.notFound(res, null, 'A sala não existe.');
            }

            const audio = await req.file();

            if (!audio) {
                return Send.unauthorized(res, null, 'O audio é necessário.');
            }

            const audioBuffer = await audio.toBuffer();
            const audioAsBase64 = audioBuffer.toString('base64');

            const transcription = await transcribeAudio(
                audioAsBase64,
                audio.mimetype
            );

            const embeddings = await generateEmbeddings(transcription);

            const result = (await prisma.$queryRaw`
            INSERT INTO audio_chunks (id, transcription, embeddings, "roomId")
            VALUES (gen_random_uuid(), ${transcription}, ${embeddings}::vector, ${roomId})
            RETURNING id
            `) as { id: string }[];

            const chunk = result[0];

            if (!chunk) {
                return Send.error(res, null, 'Erro ao salvar o chunk de áudio');
            }

            return Send.success(res, { chunkId: chunk.id });
        } catch (_err) {
            return Send.error(res, null, 'Falha ao transcrever o áudio.');
        }
    },
};
