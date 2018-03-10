import idb from 'idb';
import {DEED_TYPES} from './constants';

const DATABASE_VERSION = 2;

export function open_database(){
  return idb.open('lotro_store', DATABASE_VERSION, upgrade_db=>{
    switch(upgrade_db.oldVersion){
      case 0:
        let characters_store = upgrade_db.createObjectStore('characters', {keyPath:'name'});
      case 1:
        let deeds_store = upgrade_db.createObjectStore('deeds');
    }
  });
}

function _deed_fetch(db, url, deed_type){
  return fetch(url).then(resp=>{
    return resp.json();
  }).then(data=>{
    let tx = db.transaction('deeds', 'readwrite');
    let deed_store = tx.objectStore('deeds');

    deed_store.put(data, deed_type);

    return tx.complete;
  });
}

export function initial_deed_population(db_promise){
  return db_promise.then(db=>{
    if(!db) console.log('something broke...');

    //fetch Eriador deeds and store them in the local database
    let eriador_deeds = _deed_fetch(db, '/data/eriador_deeds.json', DEED_TYPES.ERIADOR);

    //fetch class deeds and store them in the local database
    let class_deeds = _deed_fetch(db, '/data/class_deeds.json', DEED_TYPES.CLASS);

    return Promise.all([eriador_deeds, class_deeds]).then(values=>{
      console.log('everything loaded fine...');
    }).catch(error=>{
      console.log('something went wrong...');
    })
  })
}

export function load_deeds_from_db(db_promise, deed_type){
  return db_promise.then(db=>{
    return db.transaction('deeds').objectStore('deeds').get(deed_type).then(data=>{
      return data
    });
  })
}