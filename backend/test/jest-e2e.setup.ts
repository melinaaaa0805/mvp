import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(__dirname, '../../.env.local'),
});

process.env.JWT_SECRET ??= 'test_secret';
process.env.JWT_EXPIRES_IN ??= '3600s';

if (process.env.DATABASE_URL?.includes('@postgres:')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace(
    '@postgres:',
    '@localhost:',
  );
}
