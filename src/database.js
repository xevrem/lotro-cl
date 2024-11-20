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
import { IDB } from "idbp";
import { DEED_CATEGORIES, BASE_URL } from "./constants";

/**
 * @typedef {Object} CharacterData
 * @property {string} name
    "name":"Aehelgyth",
 * @property {string} race
    "race":"HIGH_ELF",
 * @property {string} class
    "class":"RUNE_KEEPER",
 * @property {string} level
    "level":105,
 * @property {boolean[][]} completed 
    "completed":[
      [false],[false],[false],[false],[false],[false],[false],[false],[false],[false],[false]
    ]
  },
 */

/**
* deed data
 * @typedef {Object} DeedData
  {
 * @property {string} Category
    "Category": "Mines of Moria",
 * @property {string} Subcategory
    "Subcategory": "Meta",
 * @property {string} Faction
    "Faction": "",
 * @property {string} Type
    "Type": "M",
 * @property {string} Deed
    "Deed": "The Mines of Moria Part 1",
 * @property {string} LP
    "LP": "10",
 * @property {string} Trait
    "Trait": "",
 * @property {string} Details
    "Details": "Complete Volume 2, Books 1 - 6",
 * @property {string} Title
    "Title": "Avenger of Khazad-dum",
 * @property {string} Level
    "Level": "50-60",
 * @property {string} Party
    "Party": ""
  },
 */

const DATABASE_VERSION = 2;

/**
 * Function description.
 * @returns {Promise<IDB>} Return description.
 */
export async function openDatabase() {
  const idb = new IDB("lotro_store", DATABASE_VERSION);

  const openDb = await idb.openDB((db) => {
    switch (db.oldVersion) {
      case 0:
        db.createStore("characters");
      case 1:
        db.createStore("deeds");
      default:
        break;
    }
  });
  return openDb;
}

//fetch deed data at the url and store it according to passed deed types
/**
 *
 * @param {IDB} db
 * @param {string} url
 * @param {number} deed_type
 * @returns {Promise<IDB>}
 * @throws {Error}
 */
async function deedFetchAndStore(db, url, deed_type) {
  try {
    const resp = await fetch(BASE_URL + url);
    const data = await resp.json();
    const tx = await db.transaction("deeds", "readwrite");
    const deedStore = tx.openStore("deeds");
    await deedStore.put(data, deed_type);
    await tx.commit();
    return db;
  } catch (error) {
    console.error("deedFetchAndStore error", error);
    throw error;
  }
}

/**
 * perform initial deed fetching and storing into the indexeddb
 *
 * @param {IDB} db
 * @returns {Promise<void>}
 */
export async function initialDeedPopulation(db) {
  if (!db) {
    console.error("initial_deed_population something broke...");
    throw new Error("ERROR PEFORMING INITIAL DEED POPULATION");
  }

  //fetch class deeds and store them
  const class_deeds = deedFetchAndStore(
    db,
    "/data/class_deeds.json",
    DEED_CATEGORIES.CLASS
  );
  //fetch race deeds and store them
  const race_deeds = deedFetchAndStore(
    db,
    "/data/race_deeds.json",
    DEED_CATEGORIES.RACE
  );
  //fetch epic deeds and store them
  const soa_deeds = deedFetchAndStore(
    db,
    "/data/soa_deeds.json",
    DEED_CATEGORIES["SHADOWS OF ANGMAR"]
  );
  const mom_deeds = deedFetchAndStore(
    db,
    "/data/mom_deeds.json",
    DEED_CATEGORIES["THE MINES OF MORIA"]
  );
  const aotk_deeds = deedFetchAndStore(
    db,
    "/data/aotk_deeds.json",
    DEED_CATEGORIES["ALLIES TO THE KING"]
  );
  const tsos_deeds = deedFetchAndStore(
    db,
    "/data/tsos_deeds.json",
    DEED_CATEGORIES["THE STRENGTH OF SAURON"]
  );
  const bbom_deeds = deedFetchAndStore(
    db,
    "/data/bbom_deeds.json",
    DEED_CATEGORIES["THE BLACK BOOK OF MORDOR"]
  );
  //fetch reputation deeds and store them
  const rep_deeds = deedFetchAndStore(
    db,
    "/data/rep_deeds.json",
    DEED_CATEGORIES.REPUTATION
  );
  //fetch overworld deeds and store them
  const eriador_deeds = deedFetchAndStore(
    db,
    "/data/eriador_deeds.json",
    DEED_CATEGORIES.ERIADOR
  );
  const rhov_deeds = deedFetchAndStore(
    db,
    "/data/rhov_deeds.json",
    DEED_CATEGORIES.RHOVANION
  );
  const gondor_deeds = deedFetchAndStore(
    db,
    "/data/gondor_deeds.json",
    DEED_CATEGORIES.GONDOR
  );
  const mordor_deeds = deedFetchAndStore(
    db,
    "/data/mordor_deeds.json",
    DEED_CATEGORIES.MORDOR
  );
  const skirm_deeds = deedFetchAndStore(
    db,
    "/data/skirm_deeds.json",
    DEED_CATEGORIES.SKIRMISH
  );
  const soa_inst = deedFetchAndStore(
    db,
    "/data/soa_inst_deeds.json",
    DEED_CATEGORIES["INSTANCES SHADOWS OF ANGMAR"]
  );
  const mom_inst = deedFetchAndStore(
    db,
    "/data/mom_inst_deeds.json",
    DEED_CATEGORIES["INSTANCES MINES OF MORIA"]
  );
  const loth_inst = deedFetchAndStore(
    db,
    "/data/loth_inst_deeds.json",
    DEED_CATEGORIES["INSTANCES LOTHLORIEN"]
  );
  const mirk_inst = deedFetchAndStore(
    db,
    "/data/mirk_inst_deeds.json",
    DEED_CATEGORIES["INSTANCES MIRKWOOD"]
  );
  const ita_inst = deedFetchAndStore(
    db,
    "/data/ita_inst_deeds.json",
    DEED_CATEGORIES["INSTANCES IN THEIR ABSENCE"]
  );
  const isen_inst = deedFetchAndStore(
    db,
    "/data/isen_inst_deeds.json",
    DEED_CATEGORIES["INSTANCES RISE OF ISENGUARD"]
  );
  const ereb_inst = deedFetchAndStore(
    db,
    "/data/erebor_inst_deeds.json",
    DEED_CATEGORIES["INSTANCES ROAD TO EREBOR"]
  );
  const osg_inst = deedFetchAndStore(
    db,
    "/data/osg_inst_deeds.json",
    DEED_CATEGORIES["INSTANCES ASHES OF OSGILIATH"]
  );
  const pel_inst = deedFetchAndStore(
    db,
    "/data/pel_inst_deeds.json",
    DEED_CATEGORIES["INSTANCES BATTLE OF PELENNOR"]
  );
  const seh_deeds = deedFetchAndStore(
    db,
    "/data/seh_deeds.json",
    DEED_CATEGORIES["SOCIAL, EVENTS, AND HOBBIES"]
  );
  const special_deeds = deedFetchAndStore(
    db,
    "/data/bobb_deeds.json",
    DEED_CATEGORIES.SPECIAL
  );

  try {
    const results = await Promise.allSettled([
      class_deeds,
      race_deeds,
      soa_deeds,
      mom_deeds,
      aotk_deeds,
      tsos_deeds,
      bbom_deeds,
      rep_deeds,
      eriador_deeds,
      rhov_deeds,
      gondor_deeds,
      mordor_deeds,
      skirm_deeds,
      soa_inst,
      mom_inst,
      loth_inst,
      mirk_inst,
      ita_inst,
      isen_inst,
      ereb_inst,
      osg_inst,
      pel_inst,
      seh_deeds,
      special_deeds,
    ]);
    if (results.every((result) => result.status !== "fulfilled")) {
      console.error(
        "d:idp::initial_deed_population something went wrong...",
        results
      );
      throw new Error("ERROR IN AN INITIAL DEED POPULATION FETCH");
    }
  } catch (error) {
    console.error("d:idp::initial_deed_population deed fetch error:\n", error);
    throw new Error("ERROR FETCHING INITIAL DEED POPULATIONS");
  }
}

/**
 * return all deeds of passed DEED_TYPE
 * @param  {IDB} db idb database Promise
 * @param  {number} deed_type DEED_TYPE desired
 * @return {Promise<DeedData[]>} Array of deeds
 */
export async function get_deeds_of_type(db, deed_type) {
  const tx = await db.transaction("deeds");
  const deedStore = tx.openStore("deeds");
  const deedRequest = await deedStore.get(deed_type);
  return deedRequest;
}

/**
 * get all deeds
 * @param {IDB} db
 * @returns {Promise<DeedData[][]>}
 */
export async function get_all_deeds(db) {
  const tx = await db.transaction("deeds");
  const deedStore = tx.openStore("deeds");
  const deedRequest = await deedStore.getAll();
  return deedRequest;
}

/**
 * get character from database at index
 * @param {Promise<IDB>} db_promise
 * @param {string} index
 * @returns {Promise<CharacterData>}
 */
export async function get_character(db_promise, index) {
  const db = await db_promise;
  const tx = await db.transaction("characters");
  const deedStore = tx.openStore("characters");
  const deedRequest = await deedStore.get(index);
  return deedRequest;
}

/**
 * save_characters description
 * @param  {IDB} db idb database promise
 * @param  {CharacterData[]} characters characters to save
 * @return {Promise<void>} transaction promise
 */
export async function save_characters(db, characters) {
  const tx = await db.transaction("characters", "readwrite");
  const characterStore = tx.openStore("characters");
  // update characters
  /** @type {Promise<IDBValidKey>[]}*/
  const allPuts = new Array();
  characters.forEach((character, i) => {
    allPuts.push(characterStore.put(character, i));
  });
  await Promise.all(allPuts);
  await tx.commit();
}

/**
 * delete a specific character by index
 *
 * @param {IDB} db
 * @param {string} character_index
 * @returns {Promise<void>}
 */
export async function delete_character(db, character_index) {
  const tx = await db.transaction("characters", "readwrite");
  const characterStore = tx.openStore("characters");
  await characterStore.delete(character_index);
  await tx.commit();
}

/**
 * delete all characters
 *
 * @param {IDB} db
 * @returns {Promise<void>}
 */
export async function clear_characters(db) {
  const tx = await db.transaction("characters", "readwrite");
  const characterStore = tx.openStore("characters");
  await characterStore.clear();
  await tx.commit();
}

/**
 * reset the database
 *
 * @param {IDB} db
 * @returns {Promise<void>}
 */
export async function reset_database(db) {
  // reset characters
  let tx = await db.transaction("characters", "readwrite");
  await tx.openStore("characters").clear();
  await tx.commit();

  // reset deeds
  tx = await db.transaction("deeds", "readwrite");
  await tx.openStore("deeds").clear();
  await tx.commit();
}
