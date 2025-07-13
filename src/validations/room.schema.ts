import { z } from 'zod';

const createRoomSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
});

export const roomSchema = {
    createRoomSchema,
};
