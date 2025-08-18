import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Logger
  app.useLogger(app.get(Logger));

  // Security
  app.use(helmet());
  
  // CORS
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-domain.com'] 
      : ['http://localhost:3000'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Oryum House API')
    .setDescription('Sistema de gestão de condomínios - API REST')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticação e autorização')
    .addTag('condominiums', 'Gestão de condomínios')
    .addTag('units', 'Gestão de unidades')
    .addTag('tickets', 'Sistema de demandas/tickets')
    .addTag('areas', 'Áreas comuns')
    .addTag('bookings', 'Reservas de áreas')
    .addTag('notices', 'Comunicados e avisos')
    .addTag('assemblies', 'Assembleias e votações')
    .addTag('deliveries', 'Entregas e portaria')
    .addTag('visitors', 'Visitantes e autorizações')
    .addTag('documents', 'Documentos')
    .addTag('maintenance', 'Manutenções')
    .addTag('incidents', 'Ocorrências e incidentes')
    .addTag('reports', 'Relatórios')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 API rodando em http://localhost:${port}`);
  console.log(`📚 Documentação em http://localhost:${port}/api/docs`);
}

bootstrap();
