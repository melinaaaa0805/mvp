import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

// ✅ Export bootstrap pour que start.ts puisse l'utiliser
export async function bootstrap(port?: number) {
  console.log('PORT =', process.env.PORT);
  console.log('DATABASE_URL =', !!process.env.DATABASE_URL);

  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('MVP API')
    .setDescription("Documentation de l'API")
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  console.log('PORT =', process.env.PORT);
  console.log('DATABASE_URL =', !!process.env.DATABASE_URL);

  // Port : Render fournit process.env.PORT
  const listenPort = port ?? process.env.PORT ?? 4000;
  await app.listen(listenPort, '0.0.0.0');
  console.log(`🚀 Server listening on port ${listenPort}`);
}

// Dev local
if (require.main === module) {
  void bootstrap();
}
