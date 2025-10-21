// Service Worker for caching
const CACHE_NAME = 'nutriplanner-v1'
const STATIC_CACHE = 'nutriplanner-static-v1'
const DYNAMIC_CACHE = 'nutriplanner-dynamic-v1'

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // CSS and JS will be added automatically at build time
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/recipes/,
  /\/api\/ratings/,
  /\/api\/users/
]

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch intercept
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle GET requests over http/https
  const isHttp = url.protocol === 'http:' || url.protocol === 'https:'
  if (request.method !== 'GET' || !isHttp) {
    return // let the browser handle non-GET or non-http(s) requests
  }

  // Handle static assets
  if (request.method === 'GET') {
    // Static asset cache strategy
    if (isStaticAsset(request)) {
      event.respondWith(cacheFirst(request))
      return
    }

    // API cache strategy
    if (isApiRequest(request)) {
      event.respondWith(networkFirst(request))
      return
    }

    // Image cache strategy
    if (isImageRequest(request)) {
      event.respondWith(cacheFirst(request))
      return
    }
  }

  // Other requests: network-first strategy
  event.respondWith(networkFirst(request))
})

// Determine if static asset
function isStaticAsset(request) {
  const url = new URL(request.url)
  return url.pathname.endsWith('.html') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.json') ||
         url.pathname === '/'
}

// Determine if API request
function isApiRequest(request) {
  const url = new URL(request.url)
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))
}

// Determine if image request
function isImageRequest(request) {
  const url = new URL(request.url)
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname)
}

// Cache-first strategy
async function cacheFirst(request) {
  try {
    const url = new URL(request.url)
    const isHttp = url.protocol === 'http:' || url.protocol === 'https:'
    const isGet = request.method === 'GET'

    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok && isHttp && isGet) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('Cache first strategy failed:', error)
    return new Response('Offline', { status: 503 })
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const url = new URL(request.url)
    const isHttp = url.protocol === 'http:' || url.protocol === 'https:'
    const isGet = request.method === 'GET'

    const networkResponse = await fetch(request)
    if (networkResponse.ok && isHttp && isGet) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    return new Response('Offline', { status: 503 })
  }
}

// Background sync
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  console.log('Background sync triggered')
  // Implement your background sync logic here
}

// Push notifications
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/')
  )
})
