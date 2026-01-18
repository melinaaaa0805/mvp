npx prisma migrate deploy
npx prisma db seed
echo "Starting server..."
node dist/main.js