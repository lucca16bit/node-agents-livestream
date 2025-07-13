import { z } from 'zod';

const roomIdExistsSchema = z.object({
    roomId: z.string(),
});

const createQuestionSchema = z.object({
    question: z.string().min(1),
    answer: z.string().optional(),
});

export const questionSchema = {
    createQuestionSchema,
    roomIdExistsSchema,
};
