/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const rooms = await prisma.rooms.createMany({
        data: [
            {
                name: 'Sala Principal',
                description: 'Sala principal para discussões gerais',
            },
            {
                name: 'Sala de Tecnologia',
                description: 'Discussões sobre tecnologia e desenvolvimento',
            },
            {
                name: 'Sala de Games',
                description: 'Para conversas sobre jogos e entretenimento',
            },
            {
                name: 'Sala Privada',
                description: 'Sala para conversas privadas',
            },
        ],
    });
    console.log(rooms);
}
main()
    .then(async () => {
        console.log('Seeding concluído!');
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
