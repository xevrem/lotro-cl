import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LotroApp from './components/LotroApp';

let refreshing = false;

ReactDOM.render(<LotroApp update={false}/>, document.getElementById('root'));
register_service_worker();


function register_service_worker(){
  if(!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/service_worker.js').then(registration=>{
    if(registration.waiting){
      update_ready(registration.waiting);
      return;
    }

    if(registration.installing){
      track_installing(registration.installing);
      return;
    }

    registration.addEventListener('updatefound', ()=>{
      track_installing(registration.installing);
    });
  });

  navigator.serviceWorker.addEventListener('controllerchange', function() {
    //if (refreshing) return;
    window.location.reload();
    //refreshing = true;
  });
}

//let user know service worker can update
function update_ready(worker){
  console.log('update_ready called...');

  //TODO: add some sort of update mechanism for users...
  ReactDOM.render(<LotroApp update={true} worker={worker}/>, document.getElementById('root'));
}

function track_installing(worker){
  console.log('track_installing called...');
  worker.addEventListener('statechange', ()=>{
    if (worker.state == 'installed') {
      update_ready(worker);
    }
  });
}

