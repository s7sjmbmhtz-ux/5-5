const CACHE = "5x5-shell-v25";
const ASSETS = [
  "/5-5/",
  "/5-5/index.html",
  "/5-5/manifest.webmanifest?v=24",
  "/5-5/icon-192.png?v=24",
  "/5-5/icon-512.png?v=24",
  "/5-5/apple-touch-icon.png?v=24",
  "/5-5/splash.png?v=24",
  "/5-5/news.json",
  "/5-5/dashboard.json"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.url.includes("supabase") || e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) { data = { body: event.data ? event.data.text() : '' }; }
  const title = data.title || 'БК «5х5»';
  const options = {
    body: data.body || '',
    icon: '/5-5/icon-192.png?v=24',
    badge: '/5-5/icon-192.png?v=24',
    tag: data.tag || '5x5-club',
    data: { url: data.url || '/5-5/' },
    renotify: true
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || '/5-5/', self.location.origin).href;
  event.waitUntil((async () => {
    const clientsList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientsList) {
      if ('focus' in client) {
        if ('navigate' in client) await client.navigate(target).catch(() => {});
        return client.focus();
      }
    }
    return clients.openWindow ? clients.openWindow(target) : undefined;
  })());
});
