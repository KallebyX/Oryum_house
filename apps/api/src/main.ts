import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

/**
 * Generate a random secret for non-production environments
 */
function generateFallbackSecret(name: string): string {
  const crypto = require('crypto');
  const secret = crypto.randomBytes(32).toString('hex');
  Logger.warn(
    `⚠️  Using auto-generated ${name} for non-production environment. ` +
    `Set ${name} environment variable for consistent JWT validation across deployments.`,
    'Environment'
  );
  return secret;
}

/**
 * Validate required environment variables
 */
function validateEnvironment() {
  const isVercel = !!process.env.VERCEL;
  const isProduction = process.env.NODE_ENV === 'production';
  const isNonVercelProduction = isProduction && !isVercel;

  // Only require JWT secrets for non-Vercel production (self-hosted)
  // On Vercel (including production), we can auto-generate secrets with a warning
  // This allows easier deployment while encouraging proper configuration
  const required = ['DATABASE_URL'];

  // JWT secrets are strictly required only for self-hosted production
  if (isNonVercelProduction) {
    required.push('JWT_SECRET', 'JWT_REFRESH_SECRET');
  } else {
    // For Vercel deployments (all environments) and local dev, provide fallbacks if not set
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = generateFallbackSecret('JWT_SECRET');
      if (isVercel && process.env.VERCEL_ENV === 'production') {
        Logger.warn(
          '🔐 JWT_SECRET was auto-generated for this Vercel production deployment. ' +
          'For security, add JWT_SECRET to your Vercel Environment Variables.',
          'Security'
        );
      }
    }
    if (!process.env.JWT_REFRESH_SECRET) {
      process.env.JWT_REFRESH_SECRET = generateFallbackSecret('JWT_REFRESH_SECRET');
      if (isVercel && process.env.VERCEL_ENV === 'production') {
        Logger.warn(
          '🔐 JWT_REFRESH_SECRET was auto-generated for this Vercel production deployment. ' +
          'For security, add JWT_REFRESH_SECRET to your Vercel Environment Variables.',
          'Security'
        );
      }
    }
  }

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const vercelNote = process.env.VERCEL
      ? '\n\n📋 Vercel Deployment: Add these variables in your Vercel project settings:\n' +
        '   Dashboard → Settings → Environment Variables\n' +
        '   Make sure to add them for Production, Preview, and Development environments.'
      : '';

    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.' +
      vercelNote
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

  // CORS - Enhanced configuration with Vercel support
  let allowedOrigins: string[] | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void);

  if (process.env.CORS_ORIGINS) {
    // Use configured CORS origins
    allowedOrigins = process.env.CORS_ORIGINS.split(',').map(origin => origin.trim());
  } else if (process.env.VERCEL) {
    // On Vercel, dynamically allow Vercel preview URLs and the production URL
    const vercelUrl = process.env.VERCEL_URL;
    const vercelEnv = process.env.VERCEL_ENV;

    logger.log(`🌐 Vercel environment detected: ${vercelEnv}`);

    // Dynamic origin validation for Vercel deployments
    allowedOrigins = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) {
        callback(null, true);
        return;
      }

      // Allow Vercel preview/production URLs
      const isVercelUrl = origin.includes('.vercel.app') || origin.includes('.vercel.sh');
      const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');

      if (isVercelUrl || isLocalhost) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    };

    if (vercelUrl) {
      logger.log(`🔗 Vercel URL: https://${vercelUrl}`);
    }
  } else if (process.env.NODE_ENV === 'production') {
    // In non-Vercel production, CORS_ORIGINS must be explicitly set
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
