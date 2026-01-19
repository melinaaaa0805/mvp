import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(
    `🚀 Seeding ${isProduction ? 'PRODUCTION' : 'STAGING/DEV'} database...`,
  );

  const passwordHash = await bcrypt.hash('password123', 10);

  if (!isProduction) {
    // --- MODE STAGING / DEV ---

    // Nettoyage complet pour repartir de zéro en dev
    await prisma.order.deleteMany({});
    await prisma.user.deleteMany({});

    // 1. Création de l'Admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@staging.com',
        password: passwordHash,
        role: Role.ADMIN,
      },
    });

    // 2. Création de plusieurs utilisateurs et leurs commandes
    const userCount = 5; // Nombre d'utilisateurs à créer

    for (let i = 1; i <= userCount; i++) {
      const user = await prisma.user.create({
        data: {
          email: `user${i}@staging.com`,
          password: passwordHash,
          role: Role.USER,
        },
      });

      // Création de 3 commandes par utilisateur avec des statuts variés
      await prisma.order.createMany({
        data: [
          {
            title: `Commande A - User ${i}`,
            amount: 10 * i,
            status: OrderStatus.VALIDATED,
            userId: user.id,
          },
          {
            title: `Commande B - User ${i}`,
            amount: 5 * i,
            status: OrderStatus.PENDING,
            userId: user.id,
          },
          {
            title: `Commande C - User ${i}`,
            amount: 15 * i,
            status: OrderStatus.FAILED,
            userId: user.id,
          },
        ],
      });
    }

    // Ajout de commandes spécifiques à l'admin pour le test
    await prisma.order.create({
      data: {
        title: 'Commande Admin',
        amount: 100,
        status: OrderStatus.VALIDATED,
        userId: admin.id,
      },
    });
  } else {
    // --- MODE PRODUCTION ---

    const prodEmails = ['user1@prod.com', 'user2@prod.com'];

    for (const email of prodEmails) {
      await prisma.user.upsert({
        where: { email: email },
        update: {}, // On ne modifie rien s'il existe déjà
        create: {
          email: email,
          password: passwordHash, // Note: En vrai prod, utilisez des variables d'environnement !
          role: Role.USER,
        },
      });
    }
  }

  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
