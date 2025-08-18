import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

// Módulo simples para teste
import { Module, Controller, Get } from '@nestjs/common';

@Controller()
class AppController {
  @Get()
  getHello() {
    return {
      message: 'Oryum House API funcionando! 🏠',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      status: 'healthy'
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

@Module({
  controllers: [AppController],
})
class SimpleAppModule {}

async function bootstrap() {
  const app = await NestFactory.create(SimpleAppModule);

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 API simples rodando em http://localhost:${port}`);
  console.log(`🔍 Health check: http://localhost:${port}/api/health`);
}

bootstrap();
