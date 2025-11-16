import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { CACHE_KEY_METADATA, CACHE_TTL_METADATA } from '../decorators/cache-key.decorator';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;

    // Only cache GET requests
    if (method !== 'GET') {
      return next.handle();
    }

    // Build cache key
    const customKey = this.reflector.get<string>(CACHE_KEY_METADATA, context.getHandler());
    const cacheKey = customKey || this.buildCacheKey(url, user?.id);

    // Check cache
    const cachedResponse = await this.cacheManager.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    // Get custom TTL or use default
    const customTTL = this.reflector.get<number>(CACHE_TTL_METADATA, context.getHandler());
    const ttl = customTTL || 60 * 1000; // 1 minute default

    // Cache the response
    return next.handle().pipe(
      tap(async (response) => {
        await this.cacheManager.set(cacheKey, response, ttl);
      }),
    );
  }

  private buildCacheKey(url: string, userId?: string): string {
    const baseKey = url.replace(/\//g, ':');
    return userId ? `${userId}${baseKey}` : baseKey;
  }
}
