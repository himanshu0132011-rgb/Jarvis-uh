'use strict';
const VERSION = 'jarvis-timer-v1';
const BASE = new URL('./', self.location.href);
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(FILES.map(path => new URL(path, BASE).href))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response && response.ok && new URL(event.request.url).origin === self.location.origin) {
      const copy = response.clone();
      caches.open(VERSION).then(cache => cache.put(event.request, copy)).catch(() => {});
    }
    return response;
  }).catch(() => caches.match(new URL('./index.html', BASE).href))));
});
