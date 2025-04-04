const CACHE_NAME = "static-cache-v1";
const PRECACHE_FILES = [
  "/",
  "/index.html",
  "/styles.css",
  "/main.js",
  "/offline.html",
  "/manifest.json",
  "/favicon.ico",
  "/static/css/main.css",
  "/static/js/main.js",
  "/static/js/bundle.js",
  "/our_moments-192px.png",
  "/our_moments-512px.png",
  "current_location_icon.png",
  "moment_marker.gif",
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
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).catch(() => caches.match("/index.html"))
        );
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request)
            .then((networkResponse) => {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            })
            .catch(() => console.log("[ServiceWorker] Network fetch failed"))
        );
      })
    );
  }
});
