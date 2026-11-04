const CACHE_NAME = 'apple-wallet-pwa-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/aistudio/IMG_4731_f36bb356.png',
  '/assets/aistudio/9E88B6A4-51E6-40D3-892E-BADA90DEA763_51843e23.png',
  '/amex-card.png',
  '/bog-logo.png',
  '/apple-pay.mp3',
  '/icon.svg',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
