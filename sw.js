'use strict';

// Increase VERSION when changing app files. Updates wait for the user's choice.
const VERSION = 'v3';
const PREFIX = 'mums-frequency-tracker-';
const CACHE_NAME = PREFIX + VERSION;
const BASE = new URL('./', self.location.href);
const FILES = ['index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon.svg'];
const ASSETS = FILES.map(file => new URL(file, BASE).href);
const ASSET_URLS = new Set(ASSETS);
const INDEX_URL = new URL('index.html', BASE).href;

self.addEventListener('install', event => {
  // Fail an incomplete install; a previous working app stays available.
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(PREFIX) && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING' || (event.data && event.data.type === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== BASE.origin) return;
  const isAppNavigation = request.mode === 'navigate' &&
    (url.pathname === BASE.pathname || url.pathname === new URL(INDEX_URL).pathname);
  const assetURL = url.origin + url.pathname;
  // Never cache backups, downloads, unrelated paths or other applications.
  if (!isAppNavigation && !ASSET_URLS.has(assetURL)) return;
  const cacheKey = isAppNavigation ? INDEX_URL : assetURL;
  const network = (async () => {
    const response = await fetch(request);
    if (!response.ok || response.type === 'opaque') throw new Error('App asset unavailable');
    // Cache failure must not turn a successful online load into an error.
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(cacheKey, response.clone());
    } catch (error) { /* The online response remains usable. */ }
    return response;
  })();
  // A slow connection must not prevent the already-cached diary from opening.
  event.waitUntil(network.then(() => undefined).catch(() => undefined));
  event.respondWith((async () => {
    let timer;
    try {
      return await Promise.race([
        network,
        new Promise((resolve, reject) => {
          timer = setTimeout(() => reject(new Error('Network timeout')), 3000);
        })
      ]);
    } catch (error) {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
      if (isAppNavigation) {
        return new Response('Please connect to the internet once to finish loading Mum\'s frequency tracker.', {
          status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
      return Response.error();
    } finally {
      clearTimeout(timer);
    }
  })());
});
