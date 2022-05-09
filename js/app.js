

if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js');
}


// if ( window.caches ) {
    

//     // Crear caches
//     caches.open('prueba-1')
//     caches.open('prueba-2')


//     // Comprobar si existe
//     caches.has('prueba-2').then(console.log)

//     //delete
//     caches.delete('prueba-1').then( res => {
//         console.log(res, 'fue borrada')
//     })

//     // Usando cache
//     caches.open('cache-v1.1').then( cache => {

//         cache.addAll([
//             '/index.html',
//             '/css/style.css',
//             '/img/main.jpg'
//         ]).then( () => {
//             // cache.delete('/css/style.css')

//             cache.put( 'index.html', new Response('Hola Mundo') )

//         })

//         // recibir el texto
//         cache.match('/index.html').then( res => {
//             res.text().then(console.log)
//         })

//     })

//     // como llamarlo
//     caches.keys().then( keys => {
//         console.log(keys)
//     })

// }


