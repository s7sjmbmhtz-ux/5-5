const CACHE = "5x5-shell-v14";
const ASSETS = [
  "/5-5/",
  "/5-5/index.html",
  "/5-5/manifest.webmanifest?v=14",
  "/5-5/icon-192.png?v=14",
  "/5-5/icon-512.png?v=14",
  "/5-5/apple-touch-icon.png?v=14",
  "/5-5/splash.png?v=14",
  "/5-5/news.json",
  "/5-5/dashboard.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.url.includes("supabase") ||
      e.request.method !== "GET") {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
