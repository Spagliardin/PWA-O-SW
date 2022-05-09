const CACHE_STATIC_NAME = "static-v3";
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

// self.addEventListener("fetch", (e) => {
//   // 1- Cache Only
//   // App sea servida desde el cacheF

//   e.respondWith(caches.match(e.request));
// });

// ------------------------------------- 2 -----------------------------------------------------

// self.addEventListener("fetch", (e) => {
//   // 2- Cache with network fallback

//   const resp = caches.match(e.request).then((res) => {
//     if (res) return res;

//     // No existe
//     // tengo que ir a la web

//     return fetch(e.request).then((newResponse) => {
//       caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
//         cache.put(e.request, newResponse);
//         cleanCache(CACHE_DYNAMIC_NAME, 2);
//       });
//       return newResponse.clone();
//     });
//   });

//   e.respondWith(resp);
// });

// ------------------------------------- 3 -----------------------------------------------------

// self.addEventListener("fetch", (e) => {
//   // 3) Network first cache fallback

//   const fetchrequest = fetch(e.request)
//     .then(async (res) => {
//       if (!res) {
//         return caches.match(e.request);
//       }
//       await caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
//         cache.put(e.request, res);
//         cleanCache(CACHE_DYNAMIC_NAME, 50);
//       });

//       return res.clone();
//     })
//     .catch((err) => {
//       return caches.match(e.request);
//     });

//   e.respondWith(fetchrequest);
// });

// ------------------------------------- 4 -----------------------------------------------------

// self.addEventListener('fetch', e => {
//     // 4- Cache with network update
//     // performance critico
//     // Siempre estarán un paso atras

//     if (e.request.request.include('boostrap')) {
//         return e.respondWith( caches.match( e.request ) )
//     }

//     const respond = caches.open(CACHE_STATIC_NAME)
//         .then( cache => {
//             fetch(e.request).then( newRes => {
//                 cache.put( e.request, newRes )

//                 return cache.match( e.request )
//             })
//         })
//     e.respondWith(respond)
// })

// ------------------------------------- 6 -----------------------------------------------------

// self.addEventListener("fetch", (e) => {
//   // 5- Cache & Network Race

//   const response = new Promise((resolve, reject) => {
//     let rejectResponse = false;

//     const oneFail = () => {
//       if (rejectResponse) {
//         if (/\.(png|jpg)$/i.test(e.request.url)) {
//           resolve(caches.match("/img/no-img.jpg"));
//         } else {
//           reject("No se encontró respuesta");
//         }
//       } else {
//         rejectResponse = true;
//       }
//     };

//     fetch(e.request)
//       .then((res) => {
//         res.ok ? resolve(res) : oneFail();
//       })
//       .catch(oneFail);

//     caches
//       .match(e.request)
//       .then((res) => {
//         res ? resolve(res) : oneFail();
//       })
//       .catch(oneFail);
//   });

//   e.respondWith(response);
// });
