import { Module, Logger } from '@nestjs/common';
import { CacheModule as NestCacheModule, CacheOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<CacheOptions> => {
        const logger = new Logger('CacheModule');
        const isVercel = !!process.env.VERCEL;
        const redisHost = configService.get<string>('REDIS_HOST');
        const redisPort = configService.get<number>('REDIS_PORT', 6379);

        // Use Redis only if REDIS_HOST is explicitly configured and not on Vercel
        if (redisHost && !isVercel) {
          try {
            const { redisStore } = await import('cache-manager-redis-yet');
            logger.log(`Connecting to Redis at ${redisHost}:${redisPort}`);
            const store = await redisStore({
              socket: {
                host: redisHost,
                port: redisPort,
              },
              ttl: 60 * 1000, // 1 minute default TTL
            });
            return {
              store: store as any,
              isGlobal: true,
            };
          } catch (error) {
            logger.warn(`Failed to connect to Redis, falling back to in-memory cache: ${error.message}`);
          }
        }

        // Default: use in-memory cache
        // This is suitable for:
        // - Vercel serverless deployments
        // - Local development without Redis
        // - When Redis connection fails
        logger.log('Using in-memory cache (no Redis configured or in serverless environment)');
        return {
          ttl: 60 * 1000, // 1 minute default TTL
          max: 100, // Maximum number of items in cache
          isGlobal: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
