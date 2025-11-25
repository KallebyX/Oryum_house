import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

/**
 * Validate required environment variables
 */
function validateEnvironment() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Warnings for optional but recommended variables
  const recommended = [
    'REDIS_HOST',
    'REDIS_PORT',
    'S3_ENDPOINT',
    'S3_BUCKET',
    'SMTP_HOST',
  ];

  const missingRecommended = recommended.filter((key) => !process.env[key]);
  if (missingRecommended.length > 0) {
    Logger.warn(
      `Missing recommended environment variables: ${missingRecommended.join(', ')}`
    );
  }
}

async function bootstrap() {
  // Validate environment before starting
  validateEnvironment();

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = new Logger('Bootstrap');

  // Logger
  app.useLogger(app.get(Logger));

  // Global Exception Filter (catches all errors)
  app.useGlobalFilters(new AllExceptionsFilter());

  // Security
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // CORS - Enhanced configuration
  let allowedOrigins: string[];

  if (process.env.CORS_ORIGINS) {
    // Use configured CORS origins
    allowedOrigins = process.env.CORS_ORIGINS.split(',').map(origin => origin.trim());
  } else if (process.env.NODE_ENV === 'production') {
    // In production, CORS_ORIGINS must be explicitly set
    throw new Error(
      'CORS_ORIGINS environment variable is required in production.\n' +
      'Please set CORS_ORIGINS in your .env file with comma-separated allowed origins.\n' +
      'Example: CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com'
    );
  } else {
    // Development default
    allowedOrigins = ['http://localhost:3000'];
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Total-Pages'],
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
      errorHttpStatusCode: 422,
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

  logger.log(`🚀 API rodando em http://localhost:${port}`);
  logger.log(`📚 Documentação em http://localhost:${port}/api/docs`);
  logger.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`✅ All systems operational`);
}

bootstrap().catch((error) => {
  Logger.error('Failed to start application', error);
  process.exit(1);
});
