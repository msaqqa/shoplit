const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@site.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@site.com",
      password: hashedPassword,
      role: "ADMIN",
      avatar: "",
      status: "active",
    },
  });

  console.log("Seeded admin user");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
