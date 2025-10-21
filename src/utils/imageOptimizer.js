// Image optimization utility
export class ImageOptimizer {
  /**
   * Optimize image URL: add Unsplash optimization params
   * @param {string} url - original image URL
   * @param {Object} options - optimization options
   * @returns {string} optimized URL
   */
  static optimizeImageUrl(url, options = {}) {
    if (!url) return this.getDefaultImage()
    
    // If it's a local image, return as-is
    if (url.startsWith('/images/')) {
      return url
    }
    
    // If Unsplash image, add optimization params
    if (url.includes('images.unsplash.com')) {
      try {
        const urlObj = new URL(url)
        
        // Default optimization params
        const defaultParams = {
          auto: 'format',
          fit: 'crop',
          w: options.width || 800,
          h: options.height || 600,
          q: options.quality || 80
        }
        
        // Merge user params
        const params = { ...defaultParams, ...options }
        
        // Apply query params
        Object.entries(params).forEach(([key, value]) => {
          urlObj.searchParams.set(key, value)
        })
        
        return urlObj.toString()
      } catch (error) {
        console.warn('Failed to optimize image URL:', error)
        return url
      }
    }
    
    return url
  }
  
  /**
   * Get default placeholder image
   * @param {Object} options - image options
   * @returns {string} default image URL
   */
  static getDefaultImage(options = {}) {
    const width = options.width || 800
    const height = options.height || 600
    const text = options.text || 'Image unavailable'
    
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>
      <rect width='${width}' height='${height}' fill='#f8f9fa'/>
      <g fill='#dee2e6'>
        <circle cx='${width/2}' cy='${height/2 - 40}' r='60'/>
        <rect x='${width/2 - 80}' y='${height/2 + 20}' width='160' height='20' rx='10'/>
      </g>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='18' fill='#6c757d'>${text}</text>
    </svg>`
    
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  }
  
  /**
   * Preload image
   * @param {string} url - image URL
   * @returns {Promise<HTMLImageElement>} image element
   */
  static preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }
  
  /**
   * Preload images in batch
   * @param {string[]} urls - image URL list
   * @returns {Promise<HTMLImageElement[]>} image elements
   */
  static async preloadImages(urls) {
    try {
      const promises = urls.map(url => this.preloadImage(url))
      return await Promise.all(promises)
    } catch (error) {
      console.warn('Failed to preload some images:', error)
      return []
    }
  }
  
  /**
   * Check WebP support
   * @returns {boolean} whether WebP is supported
   */
  static supportsWebP() {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }
  
  /**
   * Get optimized image format URL
   * @param {string} url - original URL
   * @returns {string} optimized URL
   */
  static getOptimizedFormat(url) {
    if (this.supportsWebP() && url.includes('images.unsplash.com')) {
      try {
        const urlObj = new URL(url)
        urlObj.searchParams.set('fm', 'webp')
        return urlObj.toString()
      } catch (error) {
        return url
      }
    }
    return url
  }
}

// Image lazy-load directive
export const lazyLoadDirective = {
  mounted(el, binding) {
    // Guard: only observe real Element nodes (e.g., <img>)
    if (!(el instanceof Element)) {
      if (import.meta.env.DEV) console.debug('lazyLoadDirective: target is not Element, skip observe')
      return
    }
    // Guard: if element is not <img>, try to find an img within
    let target = el.tagName && el.tagName.toLowerCase() === 'img' ? el : el.querySelector('img')
    if (!target) {
      if (import.meta.env.DEV) console.debug('lazyLoadDirective: no <img> found, skip observe')
      return
    }

    // Additional check to ensure target is a valid Element before observing
    if (!(target instanceof Element) || !target.nodeType || target.nodeType !== Node.ELEMENT_NODE) {
      if (import.meta.env.DEV) console.debug('lazyLoadDirective: target is not a valid Element, skip observe')
      return
    }

    // Check if target is connected to the DOM
    if (!target.isConnected) {
      if (import.meta.env.DEV) console.debug('lazyLoadDirective: target is not connected to DOM, skip observe')
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          const src = binding.value
          if (src) {
            img.src = ImageOptimizer.optimizeImageUrl(src, {
              width: img.dataset.width || 800,
              height: img.dataset.height || 600,
              quality: img.dataset.quality || 80
            })
          }
          img.classList.remove('lazy')
          img.classList.add('loaded')
          observer.unobserve(img)
        }
      })
    })

    try {
      // Final validation before observing
      if (target instanceof Element && target.nodeType === Node.ELEMENT_NODE && target.isConnected) {
        observer.observe(target)
      } else {
        if (import.meta.env.DEV) console.debug('lazyLoadDirective: final validation failed, skip observe')
      }
    } catch (error) {
      console.error('Failed to observe element:', error, target)
    }
  }
}
