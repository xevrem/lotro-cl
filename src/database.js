import idb from 'idb';
import {DEED_CATEGORIES} from './constants';

const DATABASE_VERSION = 2;

export function open_database(){
  return idb.open('lotro_store', DATABASE_VERSION, upgrade_db=>{
    switch(upgrade_db.oldVersion){
      case 0:
        upgrade_db.createObjectStore('characters');
      case 1:
        upgrade_db.createObjectStore('deeds');
    }
  });
}

//fetch deed data at the url and store it according to passed deed types
function _deed_fetch_and_store(db, url, deed_type){
  return fetch(url).then(resp=>{
    return resp.json();
  }).then(data=>{
    let tx = db.transaction('deeds', 'readwrite');
    let deed_store = tx.objectStore('deeds');

    deed_store.put(data, deed_type);

    return tx.complete;
  });
}

//perform initial deed fetching and storing into the indexeddb
export function initial_deed_population(db_promise){
  return db_promise.then(db=>{
    if(!db) console.log('something broke...');

    //fetch Eriador deeds and store them in the local database
    let eriador_deeds = _deed_fetch_and_store(db, '/data/eriador_deeds.json', DEED_CATEGORIES.ERIADOR);

    //fetch class deeds and store them in the local database
    let class_deeds = _deed_fetch_and_store(db, '/data/class_deeds.json', DEED_CATEGORIES.CLASS);

    return Promise.all([eriador_deeds, class_deeds]).then(values=>{
      console.log('everything loaded fine...');
    }).catch(error=>{
      console.log('something went wrong...');
    })
  })
}

/**
 * [return all deeds of passed DEED_TYPE]
 * @param  {[Promise]} db_promise [idb database Promise]
 * @param  {[DEED_TYPE]} deed_type  [DEED_TYPE desired]
 * @return {[Array]}            [Array of deeds]
 */
export function get_deeds_of_type(db_promise, deed_type){
  return db_promise.then(db=>{
    return db.transaction('deeds').objectStore('deeds').get(deed_type).then(data=>{
      return data
    });
  })
}

//get all deeds
export function get_all_deeds(db_promise){
  return db_promise.then(db=>{
    return db.transaction('deeds').objectStore('deeds').getAll().then(data=>{
      return data;
    });
  });
}

//get character from database at index
export function get_character(db_promise, index){
  return db_promise.then(db=>{
    return db.transaction('characters').objectStore('characters').get(index).then(data=>{
      return data;
    });
  });
}

/**
 * [save_characters description]
 * @param  {[Promise]} db_promise [idb database promise]
 * @param  {[Array]} characters [characters to save]
 * @return {[Promise]}            [transaction promise]
 */
export function save_characters(db_promise, characters){
  console.log('save_characters called...', characters);
  return db_promise.then(db=>{
    let tx = db.transaction('characters', 'readwrite');
    let character_store = tx.objectStore('characters');

    //update characters
    characters.forEach((character, i)=>{
      character_store.put(character, i);
    });

    return tx.complete;
  });
}
