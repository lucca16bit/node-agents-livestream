import { fastifyCors } from '@fastify/cors';
import { fastifyMultipart } from '@fastify/multipart';
import { fastify } from 'fastify';
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from './env.ts';
import { router } from './routes/router.ts';

const app = fastify({
    logger: env.NODE_ENV === 'production',
}).withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
    origin:
        env.NODE_ENV === 'production'
            ? ['https://agents-livestream.vercel.app']
            : 'http://localhost:5173',
});

app.register(fastifyMultipart);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get('/health', () => {
    return 'OK';
});

app.register(router);

const start = async () => {
    try {
        await app.listen({
            host: '0.0.0.0',
            port: env.PORT,
        });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
