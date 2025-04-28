const CACHE_NAME = "static-cache-v4";
const PRECACHE_FILES = [
  "/",
  "/index.html",
  "/styles.css",
  "/main.js",
  "/manifest.json",
  "/favicon.ico",
  "/static/css/main.css",
  "/static/js/main.js",
  "/static/js/bundle.js",
  "/our_moments-192px.png",
  "/our_moments-512px.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_FILES))
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
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return;
  }

  if (url.pathname.startsWith("/images") || url.pathname.startsWith("/users")) {
    event.respondWith(fetch(request).catch(() => caches.match("/index.html")));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html").then((cachedPage) => {
        return (
          cachedPage || fetch(request).catch(() => caches.match("/index.html"))
        );
      })
    );
    return;
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
          .catch(() => caches.match("/index.html"))
      );
    })
  );
});
