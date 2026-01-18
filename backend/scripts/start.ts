import { execSync } from 'child_process';

async function main() {
  try {
    console.log('🚀 Running Prisma migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    console.log('🌱 Running Prisma seed...');
    execSync('npx prisma db seed', { stdio: 'inherit' });

    // Lancer le serveur Nest
    const port = process.env.PORT ?? 4000;
    console.log(`🔥 Starting NestJS server on port ${port}...`);

    // Importer le main.js compilé par Nest
    await import('../dist/main'); // si ton main.js est dans dist/, ce script sera compilé en dist/start.js
  } catch (error) {
    console.error('❌ Error starting app:', error);
    process.exit(1);
  }
}

main();
