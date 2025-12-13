import { prisma } from "../src/db/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@chronos.com",
      password: passwordHash,
      role: "ADMIN",
      apiKey: "admin-api-key"
    }
  });

  await prisma.setting.create({
    data: {
      smtpHost: "smtp.ethereal.email",
      smtpPort: 587,
      smtpUser: "test@ethereal.email",
      smtpPassword: "password",
      smtpFrom: "Chronos <noreply@chronos.dev>",
      user: {
        connect: {
          id: admin.id
        }
      }
    }
  });

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
