import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LotroApp from './components/LotroApp';

let refreshing = false;

ReactDOM.render(<LotroApp />, document.getElementById('root'));
//register_service_worker();


function register_service_worker(){
  if(!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/service_worker.js').then(registration=>{
    //is this a service worker that is waiting to take over?
    // if(registration.waiting){
    //   update_ready(registration.waiting);
    //   return;
    // }
    //
    // //is this a service worker that is installing?
    // if(registration.installing){
    //   track_installing(registration.installing);
    //   return;
    // }
    //
    // //has a new service worker appeared?
    // registration.addEventListener('updatefound', ()=>{
    //   track_installing(registration.installing);
    // });
  });

  //if the current service worker has changed, reload this page
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('reloading...');
    window.location.reload();
  });
}

// //let user know service worker can update
// function update_ready(worker){
//   console.log('update_ready called...');
//
//   //re-render app with update notification button
//   ReactDOM.render(<LotroApp update={true} onUpdateReady={()=>{
//     //tell service worker to take over now
//     worker.postMessage({action: 'SKIP_WAITING'})}
//   }/>, document.getElementById('root'));
// }
//
// //create an state change tracker for this service worker
// function track_installing(worker){
//   console.log('track_installing called...');
//   //if this service worker finished installing, tell it to take over.
//   worker.addEventListener('statechange', ()=>{
//     if (worker.state === 'installed') {
//       update_ready(worker);
//     }
//   });
// }
