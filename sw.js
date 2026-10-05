/**
 * sw.js — Hace que la app abra sin internet.
 *
 * Guarda el programa (HTML, íconos, manifiesto) en el teléfono.
 * Los datos NO pasan por acá: van a IndexedDB desde la propia app.
 *
 * Al publicar una versión nueva, subí el número de VERSION.
 * Eso borra el caché viejo y obliga a bajar el programa actualizado.
 */

const VERSION = 'gmp-v3';
const ARCHIVOS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSION)
      .then(function (c) { return c.addAll(ARCHIVOS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (claves) {
      return Promise.all(claves.map(function (k) {
        if (k !== VERSION) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const url = e.request.url;

  // Las llamadas al backend nunca se cachean: si no hay señal, la app
  // guarda el dato localmente y lo reintenta después.
  if (url.indexOf('script.google.com') !== -1 ||
      url.indexOf('script.googleusercontent.com') !== -1) return;

  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(function (guardado) {
      if (guardado) return guardado;
      return fetch(e.request).then(function (r) {
        if (r && r.status === 200 && r.type === 'basic') {
          const copia = r.clone();
          caches.open(VERSION).then(function (c) { c.put(e.request, copia); });
        }
        return r;
      }).catch(function () {
        return caches.match('./index.html');
      });
    })
  );
});
