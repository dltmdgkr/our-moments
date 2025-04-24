const CACHE_NAME = "static-cache-v2";

const PRECACHE_FILES = [
  "/offline.html",
  "/manifest.json",
  "/favicon.ico",
  "/static/css/main.css",
  "/static/js/main.js",
  "/our_moments-192px.png",
  "/our_moments-512px.png",
];

const NO_CACHE_PATTERNS = [
  /^\/$/,
  /^\/gallery(\/.*)?$/,
  /^\/images\/[^\/]+$/,
  /^\/users(\/.*)?$/,
  /^\/images(\/.*)?$/,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  const shouldBypassCache = NO_CACHE_PATTERNS.some((pattern) =>
    pattern.test(url.pathname)
  );

  if (shouldBypassCache) {
    return event.respondWith(
      fetch(request).catch(() => caches.match("/offline.html"))
    );
  }

  event.respondWith(
    caches.match(request).then((response) => {
      return (
        response ||
        fetch(request)
          .then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => caches.match("/offline.html"))
      );
    })
  );
});
