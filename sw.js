// ===== Service worker : met l'appli en cache pour qu'elle marche hors ligne =====
// Changer le numéro de version après chaque modification des fichiers pour forcer la mise à jour.
const CACHE = 'mes-livres-v3';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'];

// Installation : on stocke les fichiers de l'appli
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

// Activation : on supprime les anciennes versions du cache
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

// Requêtes : fichiers de l'appli depuis le cache ; le reste (recherche ISBN) passe par le réseau
self.addEventListener('fetch', e => {
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});
