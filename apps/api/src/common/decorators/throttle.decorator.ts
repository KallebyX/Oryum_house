import { SetMetadata } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

/**
 * Custom throttle configurations for different endpoint types
 */

/**
 * No rate limit (for public endpoints)
 */
export const NoThrottle = () => Throttle({ default: { limit: 1000000, ttl: 1000 } });

/**
 * Light rate limit (for read-heavy endpoints)
 * 100 requests per minute
 */
export const ThrottleLight = () => Throttle({ default: { limit: 100, ttl: 60000 } });

/**
 * Medium rate limit (default for most endpoints)
 * 60 requests per minute
 */
export const ThrottleMedium = () => Throttle({ default: { limit: 60, ttl: 60000 } });

/**
 * Strict rate limit (for write-heavy endpoints)
 * 30 requests per minute
 */
export const ThrottleStrict = () => Throttle({ default: { limit: 30, ttl: 60000 } });

/**
 * Very strict rate limit (for sensitive endpoints like auth)
 * 10 requests per minute
 */
export const ThrottleVeryStrict = () => Throttle({ default: { limit: 10, ttl: 60000 } });

/**
 * Auth rate limit (for login endpoints)
 * 5 attempts per minute, 20 per hour
 */
export const ThrottleAuth = () =>
  Throttle([
    { name: 'short', limit: 5, ttl: 60000 }, // 5 per minute
    { name: 'long', limit: 20, ttl: 3600000 }, // 20 per hour
  ]);

/**
 * File upload rate limit
 * 10 uploads per minute
 */
export const ThrottleUpload = () => Throttle({ default: { limit: 10, ttl: 60000 } });

/**
 * Export rate limit (for generating reports/exports)
 * 5 per minute
 */
export const ThrottleExport = () => Throttle({ default: { limit: 5, ttl: 60000 } });
