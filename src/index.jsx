/*
Copyright 2018 Erika Jonell

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

 */
import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.scss';

import { LotroApp } from './components/LotroApp';
import { BASE_URL } from './constants';

// let refreshing = false;
const elem = document.getElementById('root');

if(!elem) throw new Error('failed to create element');

const root = createRoot(elem);
root.render(<LotroApp />);

/**
 * let user know service worker can update
 * @param {ServiceWorker} worker
 */
function update_ready(worker) {
  console.log('update_ready called...');
  worker.postMessage({ action: 'SKIP_WAITING' });
}

/**
 * create an state change tracker for this service worker
 * @param {ServiceWorker} worker
 */
function track_installing(worker) {
  console.log('track_installing called...');
  //if this service worker finished installing, tell it to take over.
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') {
      update_ready(worker);
    }
  });
}

function register_service_worker() {
  if (!navigator.serviceWorker) return;

  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register(BASE_URL + '/service_worker.js')
      .then(registration => {
        // is this a service worker that is waiting to take over?
        if (registration.waiting) {
          update_ready(registration.waiting);
          return;
        }

        //is this a service worker that is installing?
        if (registration.installing) {
          track_installing(registration.installing);
          return;
        }

        //has a new service worker appeared?
        registration.addEventListener('updatefound', () => {
          if (registration.installing) {
            track_installing(registration.installing);
          }
        });
      });

    //if the current service worker has changed, reload this page
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('reloading...');
      window.location.reload();
    });
  });
}


register_service_worker();
