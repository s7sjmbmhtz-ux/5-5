const CACHE = "5x5-shell-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", e => {
  // Пропускаем запросы к API и внешним ресурсам
  if (e.request.url.includes("5x5-api.onrender.com") || 
      e.request.url.includes("supabase.co") ||
      e.request.method !== "GET") {
    return;
  }
  
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
