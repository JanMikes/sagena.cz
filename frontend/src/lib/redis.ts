/**
 * Redis Cache Client
 *
 * Provides a simple caching interface using Redis for persistent storage.
 * Falls back gracefully if Redis is unavailable.
 *
 * NOTE: This module uses dynamic imports to avoid bundling ioredis in client-side code.
 */

// Default TTL: 24 hours (in seconds)
const DEFAULT_TTL_SECONDS = 24 * 60 * 60;

// Cache key prefix to avoid collisions
const CACHE_PREFIX = 'sagena:';

// Type for the Redis client (imported dynamically)
type RedisClient = import('ioredis').default;

// Singleton Redis client
let redisClient: RedisClient | null = null;
let redisAvailable = true;
let redisChecked = false;

/**
 * Check if we're running on the server
 */
function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Get or create Redis client (only on server)
 */
async function getRedisClient(): Promise<RedisClient | null> {
  // Redis only works on server
  if (!isServer()) {
    return null;
  }

  if (!redisAvailable) {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    if (!redisChecked) {
      console.warn('[Redis] REDIS_URL not configured, caching disabled');
      redisChecked = true;
    }
    redisAvailable = false;
    return null;
  }

  try {
    // Dynamic import to avoid bundling in client-side code
    const Redis = (await import('ioredis')).default;

    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          console.error('[Redis] Max retries reached, giving up');
          return null; // Stop retrying
        }
        return Math.min(times * 100, 2000); // Exponential backoff
      },
      lazyConnect: true,
    });

    redisClient.on('error', (err) => {
      console.error('[Redis] Connection error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('[Redis] Connected successfully');
    });

    // Connect immediately
    await redisClient.connect().catch((err) => {
      console.error('[Redis] Initial connection failed:', err.message);
      redisAvailable = false;
      redisClient = null;
    });

    return redisClient;
  } catch (error) {
    console.error('[Redis] Failed to create client:', error);
    redisAvailable = false;
    return null;
  }
}

/**
 * Get a value from cache
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = await getRedisClient();
  if (!client) {
    return null;
  }

  try {
    const data = await client.get(CACHE_PREFIX + key);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`[Redis] Error getting key ${key}:`, error);
    return null;
  }
}

/**
 * Set a value in cache with optional TTL
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<boolean> {
  const client = await getRedisClient();
  if (!client) {
    return false;
  }

  try {
    await client.setex(CACHE_PREFIX + key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[Redis] Error setting key ${key}:`, error);
    return false;
  }
}

/**
 * Delete a specific key from cache
 */
export async function cacheDelete(key: string): Promise<boolean> {
  const client = await getRedisClient();
  if (!client) {
    return false;
  }

  try {
    await client.del(CACHE_PREFIX + key);
    return true;
  } catch (error) {
    console.error(`[Redis] Error deleting key ${key}:`, error);
    return false;
  }
}

/**
 * Delete all keys matching a pattern
 */
export async function cacheDeletePattern(pattern: string): Promise<number> {
  const client = await getRedisClient();
  if (!client) {
    return 0;
  }

  try {
    const keys = await client.keys(CACHE_PREFIX + pattern);
    if (keys.length === 0) {
      return 0;
    }
    const deleted = await client.del(...keys);
    console.log(`[Redis] Deleted ${deleted} keys matching pattern: ${pattern}`);
    return deleted;
  } catch (error) {
    console.error(`[Redis] Error deleting pattern ${pattern}:`, error);
    return 0;
  }
}

/**
 * Clear all cache entries
 */
export async function cacheClearAll(): Promise<boolean> {
  const client = await getRedisClient();
  if (!client) {
    return false;
  }

  try {
    const keys = await client.keys(CACHE_PREFIX + '*');
    if (keys.length > 0) {
      await client.del(...keys);
      console.log(`[Redis] Cleared ${keys.length} cache entries`);
    }
    return true;
  } catch (error) {
    console.error('[Redis] Error clearing cache:', error);
    return false;
  }
}

/**
 * Get cache statistics for debugging
 */
export async function cacheStats(): Promise<{
  available: boolean;
  keyCount: number;
  keys: string[];
} | null> {
  const client = await getRedisClient();
  if (!client) {
    return { available: false, keyCount: 0, keys: [] };
  }

  try {
    const keys = await client.keys(CACHE_PREFIX + '*');
    return {
      available: true,
      keyCount: keys.length,
      keys: keys.map((k) => k.replace(CACHE_PREFIX, '')),
    };
  } catch (error) {
    console.error('[Redis] Error getting stats:', error);
    return { available: false, keyCount: 0, keys: [] };
  }
}

/**
 * Helper: Get or set cache with automatic fetch on miss
 */
export async function cacheGetOrSet<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<T> {
  // Try to get from cache first
  const cached = await cacheGet<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Cache miss - fetch fresh data
  const data = await fetchFn();

  // Store in cache (don't await - fire and forget)
  cacheSet(key, data, ttlSeconds).catch(() => {
    // Ignore cache write errors
  });

  return data;
}
