import { execSync } from 'child_process';

async function main() {
  try {
    console.log('🚀 Running Prisma migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    console.log('🌱 Running Prisma seed...');
    execSync('npx prisma db seed', { stdio: 'inherit' });

    console.log('🔥 Starting NestJS server...');

    // Appel de main.ts compilé en dist
    // start.ts
    const mainModule: any = await import('../dist/main.js');
    const bootstrap = mainModule.bootstrap ?? mainModule.default?.bootstrap;
    await bootstrap(process.env.PORT ? +process.env.PORT : 4000);
  } catch (err) {
    console.error('❌ Error starting the app:', err);
    process.exit(1);
  }
}

main();
