// FacturaView Service Worker
const CACHE_NAME = 'facturaview-v1'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json'
]

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  // Activate immediately
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    })
  )
  // Take control of all pages immediately
  self.clients.claim()
})

// Fetch: network first for HTML, cache first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle same-origin requests
  if (url.origin !== location.origin) return

  // HTML: network first (for updates)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the latest version
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Assets: cache first, network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached

      return fetch(request).then((response) => {
        // Cache JS and CSS files
        if (
          response.ok &&
          (url.pathname.endsWith('.js') ||
            url.pathname.endsWith('.css') ||
            url.pathname.startsWith('/assets/'))
        ) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
    })
  )
})
