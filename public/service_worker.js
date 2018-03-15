const CACHE_NAME = 'lotro-cl-v1'

const RESOURCES_TO_PRECACHE = [
  'index.html',
  'static/js/bundle.js',
  'favicon.ico',
  'data/characters.json',
  'data/class_deeds.json',
  'data/eriador_deeds.json',
  'static/media/lotro.0e412425.woff'
];

//preload the cache with all relevant stuffs
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(RESOURCES_TO_PRECACHE);
    })
  );
});

//perform any initial work when service worker becomes active
self.addEventListener('activate', event => {
  console.log('service_worker is now active...');
  clients.claim();

  //TODO: perform any needed cache cleanup here
});

self.addEventListener('fetch', event => {
  let request_url = new URL(event.request.url);
  
  //if requesting the 'root' page, serve the index
  if(request_url.origin == location.origin){
    if (request_url.pathname === '/') {
      event.respondWith(caches.match('index.html'));
      return;
    }
  }

  //return from cache in a stale-while-revalidate manner
  event.respondWith(async function() {
    // Optional: Normalize the incoming URL by removing query parameters.
    // Instead of https://example.com/page?key=value,
    // use https://example.com/page when reading and writing to the cache.
    // For static HTML documents, it's unlikely your query parameters will
    // affect the HTML returned. But if you do use query parameters that
    // uniquely determine your HTML, modify this code to retain them.
    let normalized_url = new URL(event.request.url);
    normalized_url.search = '';

    // Create promises for both the network response,
    // and a copy of the response that can be used in the cache.
    let fetch_response_promise = fetch(normalized_url);
    let fetch_response_clone_promise = fetch_response_promise.then(response => {
      //if it isnt something we want to cache, just return it right away
      if(!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      //clone the response stream
      return response.clone();
    });

    // event.waitUntil() ensures that the service worker is kept alive
    // long enough to complete the cache update.
    event.waitUntil(async function() {
      let cache = await caches.open(CACHE_NAME);
      await cache.put(normalized_url, await fetch_response_clone_promise);
    }());

    // Prefer the cached response, falling back to the fetch response.
    return (await caches.match(normalized_url)) || fetch_response_promise;
  }());

  // event.respondWith(
  //   caches.match(event.request).then(response => {
  //     if (response) return response;
      
  //     //clone the request stream 
  //     let fetch_request = event.request.clone();
      
  //     return fetch(fetch_request).then(response => {
  //       //if it isnt something we want to cache, just return it right away
  //       if(!response || response.status !== 200 || response.type !== 'basic') {
  //         return response;
  //       }

  //       //clone the response stream
  //       let fetch_reponse = response.clone();

  //       //cache the response for use later
  //       caches.open(CACHE_NAME).then(cache => {
  //         cache.put(event.request, fetch_reponse);
  //       });

  //       return response;
  //     });
  //   })
  // );
});


//if the app says you should take over, take over now.
self.addEventListener('message', event => {
  if (event.data.action === 'SKIP_WAITING') {
    console.log('service_worker SKIP_WAITING...');
    self.skipWaiting();
  }
});