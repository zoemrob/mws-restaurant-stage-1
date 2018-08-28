const staticCacheName = 'restaurant-cache-v2';
const files = [
    '/',
    'css/styles.css',
    'css/responsive.css',
    'js/dbhelper.js',
    'js/main.js',
    'js/ServiceWorkerController.js',
    '/index.html',
    '/restaurant.html',
    '/data/restaurants.json',
    'img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg', 'img/5.jpg',
    'img/6.jpg', 'img/7.jpg', 'img/8.jpg', 'img/9.jpg', 'img/10.jpg'
];

self.addEventListener('install', function (event)  {
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(files);
            })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.filter(cacheName => {
                        return cacheName.startsWith('restaurant-cache') && cacheName !== staticCacheName;
                    }).map(cacheName => {
                        return caches.delete(cacheName);
                    })
                )
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(err => {
                console.log('Error fetching from cache\.', err);
            })
    );
});

self.addEventListener('message', function (message) {
    switch (message.data) {
        case 'skip':
            self.skipWaiting()
                .then(() => console.log('New Service Worker successfully loaded.'))
                .catch(err => console.log('New Service Worker failed to skip waiting.', err));
            break;
    }
});