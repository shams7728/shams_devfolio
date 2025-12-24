/**
 * Request Deduplication Utility
 * 
 * Prevents duplicate API requests by caching in-flight requests
 * Requirements: 8.2
 */

type PendingRequest<T> = Promise<T>;

class RequestCache {
  private cache: Map<string, PendingRequest<any>>;
  private results: Map<string, { data: any; timestamp: number }>;
  private readonly cacheDuration: number;

  constructor(cacheDuration = 5000) {
    this.cache = new Map();
    this.results = new Map();
    this.cacheDuration = cacheDuration;
  }

  /**
   * Generate a cache key from URL and options
   */
  private getCacheKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  /**
   * Check if cached result is still valid
   */
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheDuration;
  }

  /**
   * Deduplicated fetch request
   */
  async fetch<T = any>(url: string, options?: RequestInit): Promise<T> {
    const cacheKey = this.getCacheKey(url, options);

    // Check if we have a valid cached result
    const cachedResult = this.results.get(cacheKey);
    if (cachedResult && this.isCacheValid(cachedResult.timestamp)) {
      return cachedResult.data;
    }

    // Check if request is already in flight
    const pendingRequest = this.cache.get(cacheKey);
    if (pendingRequest) {
      return pendingRequest;
    }

    // Create new request
    const request = fetch(url, options)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Cache the result
        this.results.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
        
        return data;
      })
      .finally(() => {
        // Remove from pending requests
        this.cache.delete(cacheKey);
      });

    // Store pending request
    this.cache.set(cacheKey, request);

    return request;
  }

  /**
   * Clear all caches
   */
  clear(): void {
    this.cache.clear();
    this.results.clear();
  }

  /**
   * Clear specific cache entry
   */
  clearKey(url: string, options?: RequestInit): void {
    const cacheKey = this.getCacheKey(url, options);
    this.cache.delete(cacheKey);
    this.results.delete(cacheKey);
  }

  /**
   * Invalidate cache entries matching a pattern
   */
  invalidate(pattern: RegExp): void {
    for (const key of this.results.keys()) {
      if (pattern.test(key)) {
        this.results.delete(key);
      }
    }
  }
}

// Global request cache instance
const globalRequestCache = new RequestCache();

/**
 * Deduplicated fetch function
 * Prevents duplicate requests and caches results
 */
export async function deduplicatedFetch<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  return globalRequestCache.fetch<T>(url, options);
}

/**
 * Clear the request cache
 */
export function clearRequestCache(): void {
  globalRequestCache.clear();
}

/**
 * Clear specific cache entry
 */
export function clearCacheKey(url: string, options?: RequestInit): void {
  globalRequestCache.clearKey(url, options);
}

/**
 * Invalidate cache entries matching a pattern
 */
export function invalidateCache(pattern: RegExp): void {
  globalRequestCache.invalidate(pattern);
}

/**
 * React hook for deduplicated fetch
 */
export function useDedupedFetch() {
  return {
    fetch: deduplicatedFetch,
    clearCache: clearRequestCache,
    clearKey: clearCacheKey,
    invalidate: invalidateCache,
  };
}
