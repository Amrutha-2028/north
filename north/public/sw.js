/* North service worker: makes the app installable and usable offline.
   Pages: network first, falling back to the cached app shell.
   Built assets (hashed filenames) and fonts: cache first. */
const CACHE = "north-v1";
const SHELL = ["/", "/manifest.webmanifest", "/logo.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put("/", copy));
          return response;
        })
        .catch(() => caches.match("/"))
    );
    return;
  }

  const cacheable =
    (url.origin === self.location.origin && url.pathname.startsWith("/assets/")) ||
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com";

  if (!cacheable) return;

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok || response.type === "opaque") {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});
