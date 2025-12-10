const CACHE_NAME = 'darkah-cache-v2';
const URLS_TO_CACHE = ['/', '/collection', '/offline.html'];

// Install and cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
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
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // 1️⃣ return cache first
      if (cached) return cached;

      // 2️⃣ fetch from network
      return fetch(event.request)
        .then((res) => {
          // 3️⃣ cache images + GET requests
          if (
            res.status === 200 &&
            event.request.method === 'GET' &&
            res.type === 'basic'
          ) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resClone);
            });
          }
          return res;
        })
        .catch(() => {
          // 4️⃣ show offline page for navigation
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
    })
  );
});
