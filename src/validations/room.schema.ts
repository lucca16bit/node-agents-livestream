import { z } from 'zod';

export const createRoomSchema = z.object({
    name: z.string(),
    slug: z.string(),
});
