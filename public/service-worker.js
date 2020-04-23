const applicationVersion = '1.0'

let lakanaDocumentsCache = 'lakana-documents-' + applicationVersion;

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
  '/styles.css'
];

const content = [
  ///// Automatically generated code /////
  '/content.json',
  '/content/example.png',
  '/content/process1.html',
  '/content/report1.html',
  '/content/sop1.html'
  ///// End of automatically generated code /////
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(lakanaDocumentsCache).then((cache) => {
      cache.addAll(includes);    
      cache.addAll(assets);
      cache.addAll(content);
    })
  ).then(
    self.skipWaiting()
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

