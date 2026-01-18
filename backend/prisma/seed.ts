import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`Seeding ${isProduction ? 'production' : 'staging'} database...`);

  if (!isProduction) {
    console.log('Seeding staging/local database...');

    const adminEmail = 'admin@staging.com';
    const userEmail = 'user@staging.com';

    // On nettoie d'abord les données de test pour rendre le seed idempotent
    await prisma.order.deleteMany({
      where: {
        user: {
          email: {
            in: [adminEmail, userEmail],
          },
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: {
          in: [adminEmail, userEmail],
        },
      },
    });

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Création des utilisateurs
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: adminPassword,
        role: Role.ADMIN,
      },
    });

    const user = await prisma.user.create({
      data: {
        email: userEmail,
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

    const prodEmail = 'user@prod.com';
    const prodPassword = await bcrypt.hash('prod123', 10);

    // Idempotent aussi en prod : on supprime l’utilisateur si déjà présent
    await prisma.user.deleteMany({
      where: { email: prodEmail },
    });

    await prisma.user.create({
      data: {
        email: prodEmail,
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
