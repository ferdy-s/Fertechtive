const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("adm_fertechtive_ferdy_2025", 10);

  const existing = await prisma.user.findUnique({
    where: { email: "ferdysalsabilla87@gmail.com" },
  });

  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const user = await prisma.user.create({
    data: {
      name: "ferdy salsabilla",
      email: "ferdysalsabilla87@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created:", user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
