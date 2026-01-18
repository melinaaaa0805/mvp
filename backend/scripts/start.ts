// start.ts
import { execSync } from 'child_process';

// Prisma migrations + seed
execSync('npx prisma migrate deploy', { stdio: 'inherit' });
execSync('npx prisma db seed', { stdio: 'inherit' });

// Lancer Nest
console.log('Starting server on port', process.env.PORT ?? 4000);
require('./dist/main');
