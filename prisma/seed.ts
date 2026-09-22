import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password === "change-me-before-seeding") {
    throw new Error(
      "Заповни ADMIN_EMAIL і ADMIN_PASSWORD у .env своїми значеннями перед запуском сіду.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, isAdmin: true },
    create: { email, passwordHash, isAdmin: true },
  });

  console.log(`Адмін готовий: ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
