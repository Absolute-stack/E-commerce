const CACHE_NAME = 'darkah-cache-v6'; // 🔥 Increment version
const STATIC_CACHE = 'darkah-static-v6';
const API_CACHE = 'darkah-api-v6';
const IMAGE_CACHE = 'darkah-images-v6'; // 🔥 Separate cache for images

const URLS_TO_CACHE = ['/', '/collection', '/offline.html'];

// API endpoints that should respect ETag/Cache-Control headers
const API_PATTERNS = ['/api/product/list', '/api/product/get'];

// 🔥 Helper: Check if URL is a Cloudinary image
function isCloudinaryImage(url) {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary');
}

// Install and cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(
            (key) =>
              key !== STATIC_CACHE &&
              key !== API_CACHE &&
              key !== CACHE_NAME &&
              key !== IMAGE_CACHE
          )
          .map((key) => {
            console.log('🗑️ Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// Helper: Check if URL is an API endpoint
function isApiRequest(url) {
  return API_PATTERNS.some((pattern) => url.includes(pattern));
}

// Helper: Clear API cache
async function clearApiCache() {
  const cache = await caches.open(API_CACHE);
  const keys = await cache.keys();

  const deletePromises = keys
    .filter((request) => isApiRequest(request.url))
    .map((request) => cache.delete(request));

  await Promise.all(deletePromises);
  console.log('✅ API cache cleared by service worker');
}

// 🔥 Helper: Clear image cache
async function clearImageCache() {
  const cache = await caches.open(IMAGE_CACHE);
  await caches.delete(IMAGE_CACHE);
  console.log('✅ Image cache cleared by service worker');
}

// Fetch handler with ETag-based caching for customer frontend
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // 🔥 NETWORK-FIRST for Cloudinary images (always check for updates)
  if (isCloudinaryImage(url)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache as fallback
          return caches.match(request).then((cached) => {
            if (cached) {
              console.log('⚠️ Using cached image (offline)');
              return cached;
            }
            throw new Error('Image not available offline');
          });
        })
    );
    return;
  }

  // Handle API requests with ETag validation (for product list/get)
  if (isApiRequest(url) && request.method === 'GET') {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        const cached = await cache.match(request);

        // Build fetch request with ETag if we have cached version
        const fetchInit = {
          headers: {},
        };

        if (cached) {
          const etag = cached.headers.get('ETag');
          if (etag) {
            fetchInit.headers['If-None-Match'] = etag;
          }
        }

        try {
          const response = await fetch(request, fetchInit);

          // If 304 Not Modified, backend says cached version is still good
          if (response.status === 304 && cached) {
            console.log('✅ Using cached products (304 Not Modified)');
            return cached;
          }

          // If 200 OK with fresh data, cache it
          if (response.ok && response.status === 200) {
            const cacheControl = response.headers.get('Cache-Control');

            // Only cache if backend allows it (not no-store)
            if (cacheControl && !cacheControl.includes('no-store')) {
              // Clone response before caching
              const responseToCache = response.clone();
              cache.put(request, responseToCache);
              console.log('✅ Cached fresh product data');
            }
          }

          return response;
        } catch (error) {
          // Network failed, return cached version if available
          console.log('⚠️ Network error, using cached data');
          if (cached) {
            return cached;
          }
          throw error;
        }
      })
    );
    return;
  }

  // Handle static assets and pages (CSS, JS, HTML) - NOT IMAGES
  event.respondWith(
    caches.match(request).then((cached) => {
      // Return cache first for static files
      if (cached) return cached;

      // Fetch from network
      return fetch(request)
        .then((res) => {
          // 🔥 Only cache non-image static assets
          if (
            res.status === 200 &&
            request.method === 'GET' &&
            res.type === 'basic' &&
            !isApiRequest(url) &&
            !isCloudinaryImage(url) // 🔥 Don't cache images here
          ) {
            const resClone = res.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, resClone);
            });
          }
          return res;
        })
        .catch(() => {
          // Show offline page for navigation
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
    })
  );
});

// Listen for messages (optional, for manual cache clearing)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_API_CACHE') {
    event.waitUntil(clearApiCache());
  }

  if (event.data && event.data.type === 'CLEAR_IMAGE_CACHE') {
    event.waitUntil(clearImageCache());
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
