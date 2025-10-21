// Cache management utility class
export class CacheManager {
  constructor() {
    this.CACHE_PREFIX = 'nutriplanner_'
    this.CACHE_VERSION = '1.0.0'
    this.DEFAULT_TTL = 24 * 60 * 60 * 1000 // 24 hours
  }

  /**
   * Generate cache key
   * @param {string} key - Original key
   * @returns {string} Key with prefix and version
   */
  generateKey(key) {
    return `${this.CACHE_PREFIX}${this.CACHE_VERSION}_${key}`
  }

  /**
   * Set cache
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live (ms)
   */
  set(key, data, ttl = this.DEFAULT_TTL) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl
      }
      localStorage.setItem(this.generateKey(key), JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Failed to set cache:', error)
    }
  }

  /**
   * Get cache
   * @param {string} key - Cache key
   * @returns {any|null} Cached data or null
   */
  get(key) {
    try {
      const cached = localStorage.getItem(this.generateKey(key))
      if (!cached) return null

      const cacheData = JSON.parse(cached)
      const now = Date.now()

      // Check expiration
      if (now - cacheData.timestamp > cacheData.ttl) {
        this.delete(key)
        return null
      }

      return cacheData.data
    } catch (error) {
      console.warn('Failed to get cache:', error)
      return null
    }
  }

  /**
   * Delete cache
   * @param {string} key - Cache key
   */
  delete(key) {
    try {
      localStorage.removeItem(this.generateKey(key))
    } catch (error) {
      console.warn('Failed to delete cache:', error)
    }
  }

  /**
   * Clear all application caches
   */
  clearAll() {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    try {
      const keys = Object.keys(localStorage)
      const appKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX))
      
      let totalSize = 0
      let expiredCount = 0
      const now = Date.now()

      appKeys.forEach(key => {
        try {
          const data = localStorage.getItem(key)
          if (data) {
            totalSize += data.length
            const cacheData = JSON.parse(data)
            if (now - cacheData.timestamp > cacheData.ttl) {
              expiredCount++
            }
          }
        } catch (error) {
          // Ignore parse errors
        }
      })

      return {
        totalKeys: appKeys.length,
        totalSize: totalSize,
        expiredCount: expiredCount,
        sizeKB: Math.round(totalSize / 1024 * 100) / 100
      }
    } catch (error) {
      console.warn('Failed to get cache stats:', error)
      return { totalKeys: 0, totalSize: 0, expiredCount: 0, sizeKB: 0 }
    }
  }

  /**
   * Cleanup expired caches
   */
  cleanup() {
    try {
      const keys = Object.keys(localStorage)
      const appKeys = keys.filter(key => key.startsWith(this.CACHE_PREFIX))
      const now = Date.now()

      appKeys.forEach(key => {
        try {
          const data = localStorage.getItem(key)
          if (data) {
            const cacheData = JSON.parse(data)
            if (now - cacheData.timestamp > cacheData.ttl) {
              localStorage.removeItem(key)
            }
          }
        } catch (error) {
          // If parsing fails, remove the key
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('Failed to cleanup cache:', error)
    }
  }
}

// Create global cache manager instance
export const cacheManager = new CacheManager()

// Cache decorator
export function cached(ttl = 24 * 60 * 60 * 1000) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function(...args) {
      const cacheKey = `${propertyKey}_${JSON.stringify(args)}`
      const cached = cacheManager.get(cacheKey)
      
      if (cached !== null) {
        return cached
      }

      const result = await originalMethod.apply(this, args)
      cacheManager.set(cacheKey, result, ttl)
      return result
    }

    return descriptor
  }
}

// Cache helpers for specific types
export const recipeCache = {
  set: (id, data) => cacheManager.set(`recipe_${id}`, data, 60 * 60 * 1000), // 1 hour
  get: (id) => cacheManager.get(`recipe_${id}`),
  delete: (id) => cacheManager.delete(`recipe_${id}`)
}

export const userCache = {
  set: (id, data) => cacheManager.set(`user_${id}`, data, 30 * 60 * 1000), // 30 minutes
  get: (id) => cacheManager.get(`user_${id}`),
  delete: (id) => cacheManager.delete(`user_${id}`)
}

export const ratingCache = {
  set: (recipeId, data) => cacheManager.set(`rating_${recipeId}`, data, 5 * 60 * 1000), // 5 minutes
  get: (recipeId) => cacheManager.get(`rating_${recipeId}`),
  delete: (recipeId) => cacheManager.delete(`rating_${recipeId}`)
}
