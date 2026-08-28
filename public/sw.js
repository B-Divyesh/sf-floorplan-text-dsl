const CACHE = 'floorplan-text-v3';
const SHELL = ['/manifest.webmanifest', '/assets/icon.svg', '/assets/apple-touch-icon.png', '/assets/notebook-floorplan.webp', '/assets/social-preview.jpg'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const response = await fetch('/');
    const html = await response.clone().text();
    await cache.put('/', response.clone());
    await cache.put('/demo', response.clone());
    await cache.put('/privacy', response.clone());
    await cache.put('/terms', response.clone());
    await cache.put('/404', response);
    const builtAssets = Array.from(html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g), match => match[1]);
    await cache.addAll([...new Set([...SHELL, ...builtAssets])]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok && new URL(event.request.url).origin === location.origin) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => event.request.mode === 'navigate' ? caches.match('/') : undefined))
  );
});
