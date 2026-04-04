// Nome do cache (versione para forçar atualização)
const CACHE_NAME = 'lava-jato-v1.0.2';

// Arquivos que serão armazenados em cache para funcionar offline
const urlsToCache = [
  '/lava-a-jato/',
  '/lava-a-jato/index.html',
  '/lava-a-jato/manifest.json',
  '/lava-a-jato/icons/icon-192.png',
  '/lava-a-jato/icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// Instalação: adiciona todos os arquivos ao cache
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cache aberto, adicionando arquivos...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('[Service Worker] Erro ao adicionar ao cache:', err);
      })
  );
  self.skipWaiting(); // Força ativação imediata
});

// Busca: estratégia "Cache First" (busca no cache, depois na rede)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se achou no cache, retorna
        if (response) {
          return response;
        }
        // Se não achou, busca na rede
        return fetch(event.request);
      })
  );
});

// Ativação: limpa caches antigos
self.addEventListener('activate', event => {
  console.log('[Service Worker] Ativando...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Pronto para controlar os clientes');
      return self.clients.claim();
    })
  );
});