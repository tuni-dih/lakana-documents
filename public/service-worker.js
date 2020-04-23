const lakanaDocumentsCache = 'lakana-documents-v8';

const includes = [
  '/includes/material-components-web/dist/material-components-web.min.js',
  '/includes/material-components-web/dist/material-components-web.min.css',
  '/includes/material-components-web/dist/material-components-web.min.css.map',
  '/includes/material-design-icons/iconfont/material-icons.css',
  '/includes/material-design-icons/iconfont/MaterialIcons-Regular.eot',
  '/includes/material-design-icons/iconfont/MaterialIcons-Regular.woff2',
  '/includes/material-design-icons/iconfont/MaterialIcons-Regular.woff',
  '/includes/material-design-icons/iconfont/MaterialIcons-Regular.ttf'
];

const assets = [
  '/',
  '/index.html',
  '/app.js',
  '/lakana.ico',
  '/styles.css',
  '/content/sop1.html',
  '/content/process1.html',
  '/content.json',
  '/content/example.png',
  '/content/report1.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(lakanaDocumentsCache).then((cache) => {
      cache.addAll(includes);    
      cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(key => key !== lakanaDocumentsCache)
          .map(key => caches.delete(key))
        )
    })
  )
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      return cacheResponse || fetch(event.request);
    }))
});