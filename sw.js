const CACHE_STATIC_NAME = "static-v6";
const CACHE_DYNAMIC_NAME = "dynamic-v1";
const CACHE_INMUTABLE_NAME = "inmutable-v1";

cleanCache = async (cacheName, numberItems) => {
  const cacheOpen = await caches.open(cacheName).then(async (cache) => {
    const cacheKeys = await cache.keys().then((keys) => {
      if (keys.length > numberItems) {
        cache.delete(
          keys[0].then(() => {
            cleanCache(cacheName, numberItems);
          })
        );
      }
    });
    return cacheKeys;
  });
  return cacheOpen;
};

self.addEventListener("install", (e) => {
  const cachePromise = async () => {
    const cache = await caches.open(CACHE_STATIC_NAME);
    return cache.addAll([
      "/",
      "/index.html",
      "/css/style.css",
      "/img/main.jpg",
      "/js/app.js",
      "/img/no-img.jpg",
      "/pages/offline.html"
    ]);
  };

  const cacheInmutable = async () => {
    const cache = await caches.open(CACHE_INMUTABLE_NAME);
    return cache.addAll([
      "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css",
    ]);
  };

  e.waitUntil(Promise.all([cachePromise(), cacheInmutable()]));
});

self.addEventListener('activate', e => {

    const respondActive = caches.keys().then( keys => {

        keys.forEach( key => {

            if (key !== CACHE_STATIC_NAME && key.includes('static')) {
                return caches.delete(key)
            }

        })

    })

    e.waitUntil(respondActive)

})


self.addEventListener('fetch', e => {

//   // 2- Cache with network fallback

  const resp = caches.match(e.request).then((res) => {

    if (res) return res;

    // No existe
    // tengo que ir a la web

    return fetch(e.request).then((newResponse) => {
      caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
        cache.put(e.request, newResponse);
        cleanCache(CACHE_DYNAMIC_NAME, 2);
      });
      return newResponse.clone();
    }).catch( err => {
        if (e.request.headers.get('accept').include('text/html')) {
            return cache.match('/pages/offline.html')
        }
    })
  });

  e.respondWith(resp);



})