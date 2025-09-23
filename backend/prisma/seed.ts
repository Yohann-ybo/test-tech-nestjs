import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing database...");
  // Effacer toutes les données existantes
  await prisma.user.deleteMany({});
  await prisma.todo.deleteMany({});
  console.log("Database cleared.");

  console.log("Seeding user...");
  const user1 = await prisma.user.create({
    data: {
      email: "toto@kresus.eu",
      name: "toto",
      password: "test",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "bondeau.yohann@gmail.com",
      name: "yohann",
      password: "test",
    },
  });

  console.log("Seeding todos...");
  await prisma.todo.create({
    data: {
      title: "Todo1",
      priority: "HIGH",
      executionDate: new Date("2021-10-01"),
      content: "lorem ipsum dolor sit amet",
      authorId: user1.id,
    },
  });
  await prisma.todo.create({
    data: {
      title: "Todo2",
      priority: "MEDIUM",
      executionDate: new Date("2021-10-02"),
      content: "lorem ipsum dolor sit amet",
      authorId: user1.id,
    },
  });

  await prisma.todo.create({
    data: {
      title: "Todo4",
      priority: "HIGH",
      executionDate: new Date("2023-10-01"),
      content: "lorem ipsum dolor sit amet",
      authorId: user2.id,
    },
  });
  await prisma.todo.create({
    data: {
      title: "Todo5",
      priority: "MEDIUM",
      executionDate: new Date("2022-10-02"),
      content: "lorem ipsum dolor sit amet",
      authorId: user2.id,
    },
  });
  console.log("Seeding completed.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
