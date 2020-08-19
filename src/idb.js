/**
 * [IDB is a simplified wrapper to ease use of IndexedDB]
 */
export class IDB {
  //eslint-disable-line
  constructor(dbname, version) {
    this.dbname = dbname;
    this.version = version;
    this.upgraded = false;
    this.oldVersion = -1;
  }

  /**
   * [open_db attempts to open the database for use]
   * @param  {[Function]} [onUpdrade=null] [callback that is used when IndexedDB requires an upgrade]
   * @return {[Promise]}                    [a Promise resolving upon successful database opening or rejecting on error]
   */
  openDB(onUpdrade = null) {
    let request = window.indexedDB.open(this.dbname, this.version);

    return new Promise((resolve, reject) => {
      //handle successful database opening
      request.onsuccess = (event) => {
        console.log('idb:odb:os');
        this.db = event.target.result;
        resolve(this);
      };

      //handle errors on database opening
      request.onerror = (event) => {
        let error = event.target.error;
        console.error('idb:odb:oe::', error);
        reject(error);
      };

      request.onblocked = (event) => {
        console.log('idb:odb:ob::', event)
      }

      //if provided, allow for database upgrading
      if (onUpdrade) {
        request.onupgradeneeded = (event) => {
          console.log('idb:odb:oun');
          this.upgraded = true;
          this.db = event.target.result;
          this.oldVersion = event.oldVersion;
          onUpdrade(this);
        };
      }
    });
  }

  /**
   * [create_store description]
   * @param  {[string]} name     [name of store to create]
   * @param  {[object]} options  [options for store]
   * @param  {Function} callback [callback used to make modifications to store]
   * @return {[Promise]}         [Promise that resolves upon sucessful store creation and rejects on error]
   */
  createStore(name, options = null, callback = null) {
    console.log('create_store called...');
    return new Promise((resolve, reject) => {
      let objectStore;
      if (options) {
        objectStore = new ObjectStore(
          this.db.createObjectStore(name, options),
          name
        );
      } else {
        objectStore = new ObjectStore(this.db.createObjectStore(name), name);
      }

      //if everything goes well, resolve the promise
      objectStore.store.transaction.oncomplete = () => {
        console.log('idb:cs:oc');
        resolve(this);
      };

      console.log('initial store created...');
      try {
        //store has been created, provide the store for manipulation
        if (callback) {
          callback(objectStore);
        }
      } catch (error) {
        console.error('error during store creation...', error);
        reject(error);
      }
    });
  }

  /**
   * [transaction initiates an idb transaction]
   * @param  {[string|Array]} stores  [string of store or array of stores that the transaction will act upon]
   * @param  {[string]} [mode='readonly']     [transaction mode]
   * @param  {[type]} [callback=null] [callback called upon transaction completion]
   * @return {[Promise]}                 [Promse that resolves with a Transaction or rejects on error]
   */
  transaction(stores, mode = 'readonly', callback = undefined) {
    let transaction = new Transaction(
      this,
      this.db.transaction(stores, mode),
    );
    return transaction.promisify();
  }
}

/**
 * [Transaction manages IndexeDB transactions]
 */
export class Transaction {
  /**
   * [constructor Transaction manages IndexeDB transactions]
   * @param {[type]} idb                  [a reference to IDB]
   * @param {[IDBTransaction]} transaction          [the IDBTransaction this class wraps]
   */
  constructor(idb, transaction) {
    this.idb = idb;
    this.transaction = transaction;
  }

  /**
   * [promisify turns the IDBTransaction into a promise]
   * @return {[Promise]} [Promise that resolves immediately with itself or rejects on error]
   */
  promisify() {
    return new Promise(
      (resolve, reject) => {
        this.transaction.onerror = (event) => {
          console.log('tx:onerror');
          reject(event.target);
        };

        this.transaction.onabort = (event) => {
          console.log('tx:onabort');
          reject(event.target);
        };

        resolve(this);
      }
    );
  }

  /**
   * [open_store opens the given store for this transaction]
   * @param  {[string]} name [name of store to open]
   * @return {[Promise]}      [Promes that resolves to the store or rejects on error]
   */
  openStore(name) {
    console.log('tx:os')
    let store = new ObjectStore(this.transaction.objectStore(name));
    return store;
  }

  /**
   * [abort calls the underlying IDBTransaction's abort method]
   */
  abort() {
    console.log('tx:a')
    this.transaction.abort();
  }

  commit() {
    console.log('tx:c')
    const complete = new Promise((resolve, reject) => {
      this.transaction.oncomplete = () => {
        console.log('tx:oncomplete');
        resolve(this);
      };
    });
    this.transaction.commit();
    return complete;
  }
}

/**
 * [ObjectStore manages object store access]
 */
export class ObjectStore {
  /**
   * [constructor ObjectStore manages object store access]
   * @param {[IDBObjectStore]} store [the IDBObjectStore object this wraps]
   * @param {[string]} name  [the name of the store]
   */
  constructor(store, name) {
    this.store = store;
    this.name = name;
  }

  /**
   * [create_index creates an index within the store]
   * @param  {[string]} index_name        [the name of the index to be created]
   * @param  {[string]} key_path          [the key that is being indexed]
   * @param  {[object]} [parameters=null] [additional index parameters]
   */
  createIndex(index_name, key_path, parameters = null) {
    this.store.createIndex(index_name, key_path, parameters);
  }

  /**
   * [add adds a key-value item to the store]
   * @param {[object]} value  [a value object to be added to the store]
   * @param {[string]} [key=undefined]   [key the item should be stored at]
   * @return {[Promise]}    [Promes that resolves on success or rejects on error]
   */
  add(value, key = undefined) {
    let request = new IdbRequest(this.store.add(value, key));
    return request.promisify();
  }

  /**
   * [put updates/adds a key-value item to the store]
   * @param {[object]} value  [a value object to be updated/added to the store]
   * @param {[string]} [key=undefined]   [key the item should be stored at]
   * @return {[Promise]}    [Promes that resolves on success or rejects on error]
   */
  put(value, key = undefined) {
    let request = new IdbRequest(this.store.put(value, key));
    return request.promisify();
  }

  /**
   * [get a value with the given key]
   * @param  {[string]} key [key of the value you want to get]
   * @return {[Promise]}     [Promise that resolves to the record or rejects on error]
   */
  get(key) {
    let request = new IdbRequest(this.store.get(key));
    return request.promisify();
  }

  /**
   * [get_all values in a given store]
   * @return {[Promise]} [Promise that resolves to the records or rejects on error]
   */
  getAll() {
    let request = new IdbRequest(this.store.getAll());
    return request.promisify();
  }

  /**
   * [index get index in the store with a given name]
   * @param  {[string]} name [name of index to retrieve]
   * @return {[Index]}      [the index desired]
   */
  index(name) {
    let index = new Index(this.store.index(name));
    return index;
  }

  /**
   * [delete value with provided key]
   * @param  {[string]} key [key of record desired to be deleted]
   * @return {[Promise]}     [Promise that resolves on deletion or rejects on error]
   */
  delete(key) {
    let request = new IdbRequest(this.store.delete(key));
    return request.promisify();
  }

  /**
   * [clear removes all records from the store]
   * @return {[Promise]} [Promise that resolves on clear or rejects on error]
   */
  clear() {
    let request = new IdbRequest(this.store.clear());
    return request.promisify();
  }
}

/**
 * [Index IDBIndex wrapper]
 */
export class Index {
  /**
   * [constructor IDBIndex wrapper]
   * @param {[IDBIndex]} index [the IDBIndex being wrapped]
   */
  constructor(index) {
    this.index = index;
  }

  /**
   * [cursor gets the cursor of the index and calls the callback on success]
   * @param  {Function} callback [callback called when cursor onsuccess event is fired]
   * @return {[Promise]}            [Promise that resolves when cursor has no more records or rejects on error]
   */
  open_cursor(callback, query = undefined) {
    let cursor = new Cursor(this.index.openCursor(query), callback);
    return cursor.promisify();
  }

  open_key_cursor(callback, query = undefined) {
    let cursor = new Cursor(this.index.openKeyCursor(query), callback);
    return cursor.promisify();
  }
}

/**
 * [Cursor is a wrapper around a IDBCursor]
 */
export class Cursor {
  /**
   * [constructor a wrapper around a IDBCursor]
   * @param {[IDBCursor]}   cursor   [the IDBCursor being wrapped]
   * @param {Function} callback [callback called when cursor onsuccess event is fired]
   */
  constructor(cursor, callback) {
    this.cursor = cursor;
    this.callback = callback;
  }

  /**
   * [promisify turns the IDBCursor into a promise]
   * @return {[Promise]} [Promise that resolves when cursor has no more records or rejects on error]
   */
  promisify() {
    return new Promise(
      (resolve, reject) => {
        this.cursor.onsuccess = (event) => {
          if (event.target.result) {
            if (this.callback) this.callback(event.target.result);
          } else {
            resolve(event.target.result);
          }
        }

        this.cursor.onerror = (event) => {
          reject(event.target);
        };
      }
    );
  }
}

/**
 * [IdbRequest wrapper around an IDBRequest]
 */
export class IdbRequest {
  /**
   * [constructor wrapper around an IDBRequest]
   * @param {[IDBRequest]} request [IDBRequest being wrapped]
   */
  constructor(request) {
    this.request = request;
  }

  /**
   * [promisify turns the IDBCursor into a promise]
   * @return {[Promise]} [Promise that resolves on success or rejects on error]
   */
  promisify() {
    return new Promise(
      (resolve, reject) => {
        this.request.onsuccess = (event) => {
          resolve(event.target.result);
        };
        this.request.onerror = (event) => {
          reject(event.target.error);
        };
      }
    );
  }
}
