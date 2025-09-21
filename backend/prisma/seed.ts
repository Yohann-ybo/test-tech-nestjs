import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  // Effacer toutes les données existantes
  await prisma.todo.deleteMany({});
  console.log('Database cleared.');

  console.log('Seeding...');
  await prisma.todo.create({
    data: {
      title: 'Todo1',
      priority: 'HIGH',
      executionDate: new Date('2021-10-01'),
      content: 'lorem ipsum dolor sit amet',
    },
  });
  await prisma.todo.create({
    data: {
      title: 'Todo2',
      priority: 'MEDIUM',
      executionDate: new Date('2021-10-02'),
      content: 'lorem ipsum dolor sit amet',
    },
  });
  console.log('Seeding completed.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
