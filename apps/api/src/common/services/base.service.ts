import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../core/prisma/prisma.service';

/**
 * Base service with common query optimization and caching patterns
 */
export abstract class BaseService {
  constructor(
    protected readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cache?: Cache,
  ) {}

  /**
   * Execute a query with automatic caching
   * @param key Cache key
   * @param queryFn Query function to execute
   * @param ttl Time to live in milliseconds (default: 60000 = 1 minute)
   */
  protected async withCache<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttl: number = 60000,
  ): Promise<T> {
    if (!this.cache) {
      return queryFn();
    }

    const cached = await this.cache.get<T>(key);
    if (cached) {
      return cached;
    }

    const result = await queryFn();
    await this.cache.set(key, result, ttl);
    return result;
  }

  /**
   * Invalidate cache by pattern
   * @param pattern Cache key pattern to invalidate
   */
  protected async invalidateCache(pattern: string): Promise<void> {
    if (!this.cache) {
      return;
    }

    // Note: This requires cache-manager-redis-yet which supports key scanning
    // For production, consider using a more sophisticated cache invalidation strategy
    await this.cache.del(pattern);
  }

  /**
   * Optimized select for user data (common pattern)
   */
  protected readonly userSelectBasic = {
    id: true,
    name: true,
    email: true,
  };

  protected readonly userSelectWithAvatar = {
    id: true,
    name: true,
    email: true,
    avatarUrl: true,
  };

  /**
   * Optimized select for unit data (common pattern)
   */
  protected readonly unitSelectBasic = {
    id: true,
    block: true,
    number: true,
  };

  /**
   * Optimized select for condominium data (common pattern)
   */
  protected readonly condominiumSelectBasic = {
    id: true,
    name: true,
  };

  /**
   * Check if user has access to condominium (cached)
   * @param userId User ID
   * @param condominiumId Condominium ID
   * @param roles Optional role filter
   */
  protected async hasCondominiumAccess(
    userId: string,
    condominiumId: string,
    roles?: string[],
  ): Promise<boolean> {
    const cacheKey = `access:${userId}:${condominiumId}:${roles?.join('-') || 'any'}`;

    return this.withCache(
      cacheKey,
      async () => {
        const membership = await this.prisma.membership.findFirst({
          where: {
            userId,
            condominiumId,
            isActive: true,
            ...(roles ? { role: { in: roles } } : {}),
          },
          select: { id: true },
        });

        return !!membership;
      },
      30000, // 30 seconds cache
    );
  }

  /**
   * Get user role in condominium (cached)
   */
  protected async getUserRole(
    userId: string,
    condominiumId: string,
  ): Promise<string | null> {
    const cacheKey = `role:${userId}:${condominiumId}`;

    return this.withCache(
      cacheKey,
      async () => {
        const membership = await this.prisma.membership.findFirst({
          where: {
            userId,
            condominiumId,
            isActive: true,
          },
          select: { role: true },
        });

        return membership?.role || null;
      },
      30000, // 30 seconds cache
    );
  }
}
