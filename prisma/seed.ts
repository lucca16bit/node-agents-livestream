import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.rooms.createMany({
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

    const allRooms = await prisma.rooms.findMany();

    const salaPrincipal = allRooms.find((r) => r.name === 'Sala Principal');
    const salaTecnologia = allRooms.find((r) => r.name === 'Sala de Tecnologia');

    if (!(salaPrincipal && salaTecnologia)) {
        throw new Error('Salas não encontradas');
    }

    await prisma.questions.createMany({
        data: [
            {
                question: 'Qual a finalidade desta sala?',
                answer: 'Discutir qualquer assunto geral com os membros.',
                roomId: salaPrincipal.id,
            },
            {
                question: 'Quais linguagens são abordadas aqui?',
                answer: 'JavaScript, TypeScript, Python, Java, entre outras.',
                roomId: salaTecnologia.id,
            },
            {
                question: 'É permitido divulgar projetos pessoais?',
                answer: 'Sim, desde que relacionados à tecnologia.',
                roomId: salaTecnologia.id,
            },
        ],
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async () => {
        await prisma.$disconnect();
        process.exit(1);
    });
