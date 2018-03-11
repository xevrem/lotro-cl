const static_cache_name = 'lotro-cl-v1'

//preload the cache with all relevant stuffs
self.addEventListener('install', event=>{
  event.waitUntil(
    caches.open(static_cache_name).then(function(cache) {
      return cache.addAll([
        'index.html',
        'static/js/bundle.js',
        'favicon.ico',
        'data/characters.json',
        'data/class_deeds.json',
        'data/eriador_deeds.json',
        'static/media/lotro.0e412425.woff'
      ]);
    })
  );
});

self.addEventListener('fetch', event=>{
  let request_url = new URL(event.request.url);
  
  //console.log('requesting', request_url);
  
  //if requesting the 'root' page, serve the index
  if(request_url.origin == location.origin){
    if (request_url.pathname === '/') {
      event.respondWith(caches.match('index.html'));
      return;
    }
  }

  //otherwise return from cache what you can fetching if a miss
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );

})


//if the app says you should take over, take over now.
self.addEventListener('message', function(event) {
  if (event.data.action === 'SKIP_WAITING') {
    console.log('service_worker SKIP_WAITING...')
    self.skipWaiting();
  }
});