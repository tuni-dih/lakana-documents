const applicationVersion = '3'

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
  '/content/lakana-sop-admin-01-en.html',
  '/content/lakana-sop-data-01-en.html',
  '/content/lakana-sop-admin-02-en.html',
  '/content/lakana-sop-lab-01-en.html',
  '/content/lakana-sop-lab-02-en.html',
  '/content/lakana-sop-lab-03-en.html',
  '/content/lakana-sop-lab-04-en.html',
  '/content/lakana-sop-lab-05-en.html',
  '/content/lakana-sop-pharm-01-en.html',
  '/content/lakana-sop-prep-01-en.html',
  '/content/lakana-sop-prep-02-en.html',
  '/content/lakana-sop-prep-03-en.html',
  '/content/lakana-sop-prep-04-en.html',
  '/content/lakana-sop-proc-01-en.html',
  '/content/lakana-sop-proc-03-en.html',
  '/content/lakana-sop-proc-02-en.html',
  '/content/lakana-sop-proc-04-en.html',
  '/content/lakana-sop-proc-05-en.html',
  '/content/lakana-sop-proc-06-en.html',
  '/content/lakana-sop-proc-07-en.html',
  '/content/lakana-sop-proc-08-en.html',
  '/content/lakana-sop-proc-09-en.html',
  '/content/lakana-sop-sop-01-en.html',
  '/content/lakana-sop-visit-01-en.html',
  '/content/lakana-sop-visit-02-en.html',
  '/content/lakana-sop-visit-03-en.html',
  '/content/lakana-sop-visit-04-en.html',
  '/content/lakana-sop-visit-05-en.html',
  '/content/lakana-sop-visit-06-en.html',
  '/content/lakana-sop-visit-07-en.html',
  '/content/lakana-sop-visit-08-en.html',
  '/content/lakana-sop-visit-09-en.html',
  '/content/lakana-sop-visit-12-en.html',
  '/content/lakana-sop-visit-13-en.html',
  '/content/lakana-sop-visit-10-en.html',
  '/content/lakana-sop-visit-14-en.html',
  '/content/lakana-sop-visit-11-en.html',
  '/content/lakana-sop-visit-15-en.html',
  '/content/lakana-sop-visit-16-en.html'
  ///// End of automatically generated code /////
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(lakanaDocumentsCache).then((cache) => {
      cache.addAll(includes);    
      cache.addAll(assets);
      cache.addAll(content);
    }).then(
    self.skipWaiting()
  )
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










