var CACHE_NAME = 'sparks-network-v0';
var URLS_TO_CACHE = [
  '/',
  '/app.js',
  '/sw.js',
  '/vendor.js',
  '/images/logo.svg',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }

        return fetch(event.request);
      })
  );
});