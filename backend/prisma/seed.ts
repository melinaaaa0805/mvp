import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`Seeding ${isProduction ? 'production' : 'staging'} database...`);

  if (!isProduction) {
    console.log('Seeding staging/local database...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Création des utilisateurs
    const admin = await prisma.user.create({
      data: {
        email: 'admin@staging.com',
        password: adminPassword,
        role: Role.ADMIN,
      },
    });

    const user = await prisma.user.create({
      data: {
        email: 'user@staging.com',
        password: userPassword,
        role: Role.USER,
      },
    });

    // Création des commandes liées aux utilisateurs
    await prisma.order.createMany({
      data: [
        {
          title: 'Commande validée',
          amount: 50,
          status: OrderStatus.VALIDATED,
          userId: admin.id,
        },
        {
          title: 'Commande en échec',
          amount: 20,
          status: OrderStatus.FAILED,
          userId: admin.id,
        },
        {
          title: 'Commande en cours',
          amount: 10,
          status: OrderStatus.PENDING,
          userId: user.id,
        },
      ],
    });
  } else {
    console.log('Seeding production database...');

    const prodPassword = await bcrypt.hash('prod123', 10);
    await prisma.user.create({
      data: {
        email: 'user@prod.com',
        password: prodPassword,
        role: Role.USER,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
