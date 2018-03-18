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


    //fetch class deeds and store them
    let class_deeds = _deed_fetch_and_store(db, '/data/class_deeds.json', DEED_CATEGORIES.CLASS);

    //fetch race deeds and store them
    let race_deeds = _deed_fetch_and_store(db, '/data/race_deeds.json', DEED_CATEGORIES.RACE);

    //fetch epic deeds and store them
    let epic_deeds = _deed_fetch_and_store(db, '/data/soa_deeds.json', DEED_CATEGORIES['SHADOWS OF ANGMAR']);

    //fetch Eriador deeds and store them
    let eriador_deeds = _deed_fetch_and_store(db, '/data/eriador_deeds.json', DEED_CATEGORIES.ERIADOR);


    return Promise.all([class_deeds, race_deeds, epic_deeds, eriador_deeds]).then(values=>{
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
      console.log('get_all_deeds called...', data);
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
  // console.log('save_characters called...', characters);
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

//delete a specific character by index
export function delete_character(db_promise, character_index){
  return db_promise.then(db => {
    let tx = db.transaction('characters', 'readwrite');
    let character_store = tx.objectStore('characters');
    character_store.delete(character_index);
    return tx.complete;
  });
}

//delete all characters
export function clear_characters(db_promise){
  return db_promise.then(db => {
    let tx = db.transaction('characters', 'readwrite');
    let character_store = tx.objectStore('characters');
    character_store.clear();
    return tx.complete;
  });
}

export function reset_database(db_promise){
  let reset_characters = new Promise((resolve, reject) => {
    return db_promise.then(db => {
      let tx = db.transaction('characters', 'readwrite');
      tx.objectStore('characters').clear();

      resolve(tx.complete);
    }).catch(error => {
      reject(error);
    })
  });

  let reset_deeds = new Promise((resolve, reject) => {
    return db_promise.then(db => {
      let tx = db.transaction('deeds', 'readwrite');
      tx.objectStore('deeds').clear();

      resolve(tx.complete);
    }).catch(error => {
      reject(error);
    })
  })

  return Promise.all([reset_characters, reset_deeds])
}
