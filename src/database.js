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
import idb from 'idb';
import {DEED_CATEGORIES, BASE_URL} from './constants';

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
  return fetch(BASE_URL+url).then(resp=>{
    return resp.json();
  }).then(data=>{
    let tx = db.transaction('deeds', 'readwrite');
    let deed_store = tx.objectStore('deeds');

    deed_store.put(data, deed_type);

    return tx.complete;
  }).catch(error=>{
    console.log('_deed_fetch_and_store error', error);
  });
}

//perform initial deed fetching and storing into the indexeddb
export function initial_deed_population(db_promise){
  return db_promise.then(db=>{
    if(!db) console.log('initial_deed_population something broke...');


    //fetch class deeds and store them
    let class_deeds = _deed_fetch_and_store(db, '/data/class_deeds.json', DEED_CATEGORIES.CLASS);

    //fetch race deeds and store them
    let race_deeds = _deed_fetch_and_store(db, '/data/race_deeds.json', DEED_CATEGORIES.RACE);

    //fetch epic deeds and store them
    let soa_deeds = _deed_fetch_and_store(db, '/data/soa_deeds.json', DEED_CATEGORIES['SHADOWS OF ANGMAR']);
    let mom_deeds = _deed_fetch_and_store(db, '/data/mom_deeds.json', DEED_CATEGORIES['THE MINES OF MORIA']);
    let aotk_deeds = _deed_fetch_and_store(db, '/data/aotk_deeds.json', DEED_CATEGORIES['ALLIES TO THE KING']);
    let tsos_deeds = _deed_fetch_and_store(db, '/data/tsos_deeds.json', DEED_CATEGORIES['THE STRENGTH OF SAURON']);
    let bbom_deeds = _deed_fetch_and_store(db, '/data/bbom_deeds.json', DEED_CATEGORIES['THE BLACK BOOK OF MORDOR']);

    //fetch reputation deeds and store them
    let rep_deeds = _deed_fetch_and_store(db, '/data/rep_deeds.json', DEED_CATEGORIES.REPUTATION);

    //fetch overworld deeds and store them
    let eriador_deeds = _deed_fetch_and_store(db, '/data/eriador_deeds.json', DEED_CATEGORIES.ERIADOR);
    let rhov_deeds = _deed_fetch_and_store(db, '/data/rhov_deeds.json', DEED_CATEGORIES.RHOVANION);
    let gondor_deeds = _deed_fetch_and_store(db, '/data/gondor_deeds.json', DEED_CATEGORIES.GONDOR);
    let mordor_deeds = _deed_fetch_and_store(db, '/data/mordor_deeds.json', DEED_CATEGORIES.MORDOR);

    let skirm_deeds = _deed_fetch_and_store(db, '/data/skirm_deeds.json', DEED_CATEGORIES.SKIRMISH);

    let soa_inst = _deed_fetch_and_store(db, '/data/soa_inst_deeds.json', DEED_CATEGORIES["INSTANCES SHADOWS OF ANGMAR"]);
    let mom_inst = _deed_fetch_and_store(db, '/data/mom_inst_deeds.json', DEED_CATEGORIES["INSTANCES MINES OF MORIA"]);
    let loth_inst = _deed_fetch_and_store(db, '/data/loth_inst_deeds.json', DEED_CATEGORIES["INSTANCES LOTHLORIEN"]);
    let mirk_inst = _deed_fetch_and_store(db, '/data/mirk_inst_deeds.json', DEED_CATEGORIES["INSTANCES MIRKWOOD"]);
    let ita_inst = _deed_fetch_and_store(db, '/data/ita_inst_deeds.json', DEED_CATEGORIES["INSTANCES IN THEIR ABSENCE"]);
    let isen_inst = _deed_fetch_and_store(db, '/data/isen_inst_deeds.json', DEED_CATEGORIES["INSTANCES RISE OF ISENGUARD"]);
    let ereb_inst = _deed_fetch_and_store(db, '/data/erebor_inst_deeds.json', DEED_CATEGORIES["INSTANCES ROAD TO EREBOR"]);
    let osg_inst = _deed_fetch_and_store(db, '/data/osg_inst_deeds.json', DEED_CATEGORIES["INSTANCES ASHES OF OSGILIATH"]);
    let pel_inst = _deed_fetch_and_store(db, '/data/pel_inst_deeds.json', DEED_CATEGORIES["INSTANCES BATTLE OF PELENNOR"]);

    let seh_deeds = _deed_fetch_and_store(db, '/data/seh_deeds.json', DEED_CATEGORIES["SOCIAL, EVENTS, AND HOBBIES"]);
    let special_deeds = _deed_fetch_and_store(db, '/data/bobb_deeds.json', DEED_CATEGORIES.SPECIAL);

    return Promise.all([
      class_deeds, race_deeds, soa_deeds,
      mom_deeds, aotk_deeds, tsos_deeds,
      bbom_deeds, rep_deeds, eriador_deeds,
      rhov_deeds, gondor_deeds, mordor_deeds,
      skirm_deeds, soa_inst, mom_inst,
      loth_inst, mirk_inst, ita_inst,
      isen_inst, ereb_inst, osg_inst,
      pel_inst, seh_deeds, special_deeds]).then(values=>{
      // console.log('everything loaded fine...');
    }).catch(error=>{
      console.log('initial_deed_population something went wrong...');
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
      // console.log('get_all_deeds called...', data);
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