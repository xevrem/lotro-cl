/**
 * IDB callback
 * @callback IdbUpgradeCallback
 * @param {IDB} context - current IDB context
 * @param {IDBVersionChangeEvent} event upgrade event
 */

/**
 * ObjectStore callback
 * @callback ObjectStoreCallback
 * @param {ObjectStore} context - current IDB context
 */

/**
 * Transaction callback
 * @callback TransactionCallback
 * @param {Transaction} context - current IDB context
 */

/**
 * Cursor callback
 * @template {IDBCursor | IDBCursorWithValue} T
 * @callback CursorCallback
 * @param {T} context - current IDB context
 */

/**
 * IDB is a simplified wrapper to ease use of IndexedDB
 */
export class IDB {
  /** @type {IDBDatabase?} */
  db;
  /** @type {string} */
  dbname;
  /** @type {number} */
  version;
  /** @type {boolean} */
  upgraded;
  /** @type {number} */
  oldVersion;

  /**
   * @param {string} dbname
   * @param {number} version
   */
  constructor(dbname, version) {
    this.db = null;
    this.dbname = dbname;
    this.version = version;
    this.upgraded = false;
    this.oldVersion = -1;
  }

  /**
   * attempts to open the database for use
   * @param  {IdbUpgradeCallback} [onUpgrade] callback that is used when IndexedDB requires an upgrade
   * @return {Promise<IDB>} a Promise resolving upon successful database opening or rejecting on error
   */
  openDB(onUpgrade = undefined) {
    return new Promise((resolve, reject) => {
      let request = window.indexedDB.open(this.dbname, this.version);
      //handle successful database opening
      request.onsuccess = (event) => {
        console.log("idb:odb:os");
        if (event.target) {
          this.db = request.result;
          // this.db = event.target.result;
          resolve(this);
        } else {
          reject("OPENDB:ONSUCCESS - NO EVENT");
        }
      };

      //handle errors on database opening
      request.onerror = (event) => {
        console.error("idb:odb:oe::", event, request.error);
        reject(request.error);
      };

      request.onblocked = (event) => {
        console.warn("idb:odb:ob::", event);
        reject(event);
      };

      //if provided, allow for database upgrading
      if (onUpgrade) {
        request.onupgradeneeded = (event) => {
          console.log("idb:odb:oun");
          this.upgraded = true;
          // this.db = event.target.result;
          this.db = request.result;
          this.oldVersion = event.oldVersion;
          onUpgrade(this, event);
        };
      }
    });
  }

  /**
   * create_store description
   * @param  {string} name     name of store to create
   * @param  {IDBObjectStoreParameters} [options]  options for store
   * @param  {ObjectStoreCallback} [callback] callback used to make modifications to store
   * @return {Promise<IDB>} Promise that resolves upon sucessful store creation and rejects on error
   */
  createStore(name, options = undefined, callback = undefined) {
    console.log("create_store called...");
    return new Promise((resolve, reject) => {
      let objectStore;
      if (options && this.db) {
        objectStore = new ObjectStore(
          this.db.createObjectStore(name, options),
          name
        );
      } else if (this.db) {
        objectStore = new ObjectStore(this.db.createObjectStore(name), name);
      } else {
        return reject("IDB:CreateStore - NO DATABASE");
      }

      //if everything goes well, resolve the promise
      objectStore.store.transaction.oncomplete = () => {
        console.log("idb:cs:oc");
        resolve(this);
      };

      console.log("initial store created...");
      try {
        //store has been created, provide the store for manipulation
        if (callback) {
          callback(objectStore);
        }
      } catch (error) {
        console.error("error during store creation...", error);
        reject(error);
      }
    });
  }

  /**
   * transaction initiates an idb transaction
   * @param {string | Array<string>} stores  string of store or array of stores that the transaction will act upon
   * @param {IDBTransactionMode} mode transaction mode
   * @param {IDBTransactionOptions} [options] transaction options
   * @param {TransactionCallback} [callback] callback called upon transaction completion
   * @return {Promise<Transaction>} Promse that resolves with a Transaction or rejects on error
   * @throws {Error}
   */
  transaction(
    stores,
    mode = "readonly",
    options = undefined,
    callback = undefined
  ) {
    if (this.db) {
      let transaction = new Transaction(
        this,
        this.db.transaction(stores, mode),
        callback
      );
      return transaction.promisify();
    } else {
      throw new Error("NO DATABASE PROVIDED");
    }
  }
}

/**
 * Transaction manages IndexeDB transactions
 */
export class Transaction {
  /** @type {IDB} */
  idb;
  /** @type {IDBTransaction} */
  transaction;
  /** @type {((tx: Transaction) => void) | undefined} */
  callback;

  /**
   * constructor Transaction manages IndexeDB transactions
   * @param {IDB} idb - the IDB context
   * @param {IDBTransaction} transaction - an IDBTransaction to wrap
   * @param {TransactionCallback} [callback] - a callback
   */
  constructor(idb, transaction, callback = undefined) {
    this.idb = idb;
    this.transaction = transaction;
    this.callback = callback;
  }

  /**
   * promisify turns the IDBTransaction into a promise
   * @return {Promise<Transaction>} Promise that resolves immediately with itself or rejects on error
   */
  promisify() {
    return new Promise((resolve, reject) => {
      this.transaction.onerror = (event) => {
        console.error("tx:onerror", event);
        reject(event);
      };
      this.transaction.onabort = (event) => {
        console.error("tx:onabort", event);
        reject(event);
      };
      resolve(this);
    });
  }

  /**
   * open_store opens the given store for this transaction
   * @param  {string} name name of store to open
   * @return {ObjectStore} Promes that resolves to the store or rejects on error
   */
  openStore(name) {
    console.log("tx:os");
    let store = new ObjectStore(this.transaction.objectStore(name), name);
    return store;
  }

  /**
   * abort calls the underlying IDBTransaction's abort method
   */
  abort() {
    console.log("tx:a");
    this.transaction.abort();
  }

  /**
   * @param {(tx: Transaction) => void} resolve
   * @param {Event} event
   */
  commitComplete(resolve, event) {}

  /**
   * @param {(tx: Transaction) => void} reject
   * @param {Event} error
   */
  commitError(reject, error) {}

  /**
   *
   * @returns {Promise<Transaction>}
   */
  commit() {
    console.log("tx:c");
    return new Promise((resolve, reject) => {
      this.transaction.commit();
      this.transaction.oncomplete = (event) => {
        console.log("tx:commit:complete");
        this.callback && this.callback(this);
        resolve(this);
      };
      this.transaction.onerror = (event) => {
        console.error("tx:commit:error", event);
        reject(this);
      };
    });
  }
}

/**
 * ObjectStore manages object store access
 */
export class ObjectStore {
  /**
   * constructor ObjectStore manages object store access
   * @param {IDBObjectStore} store the IDBObjectStore object this wraps
   * @param {string} name  the name of the store
   */
  constructor(store, name) {
    this.store = store;
    this.name = name;
  }

  /**
   * create_index creates an index within the store
   * @param  {string} index_name the name of the index to be created
   * @param  {string} key_path the key that is being indexed
   * @param  {IDBIndexParameters} [parameters] additional index parameters
   */
  createIndex(index_name, key_path, parameters = undefined) {
    this.store.createIndex(index_name, key_path, parameters);
  }

  /**
   * add adds a key-value item to the store
   * @template T
   * @param {T} value a value object to be added to the store
   * @param {IDBValidKey} [key] key the item should be stored at
   * @return {Promise<IDBValidKey>} resolves on success or rejects on error
   */
  add(value, key = undefined) {
    const request = new IdbRequest(this.store.add(value, key));
    return request.promisify();
  }

  /**
   * put updates/adds a key-value item to the store
   * @template T
   * @param {T} value a value object to be updated/added to the store
   * @param {IDBValidKey} [key] key the item should be stored at
   * @return {Promise<IDBValidKey>} Promes that resolves on success or rejects on error
   */
  put(value, key = undefined) {
    let request = new IdbRequest(this.store.put(value, key));
    return request.promisify();
  }

  /**
   * [get a value with the given key]
   * @template T
   * @param  {IDBValidKey | IDBKeyRange} key key of the value you want to get
   * @return {Promise<T>} Promise that resolves to the record or rejects on error
   */
  get(key) {
    let request = new IdbRequest(this.store.get(key));
    return request.promisify();
  }

  /**
   * get_all values in a given store
   * @template T
   * @return {Promise<T[]>} Promise that resolves to the records or rejects on error
   */
  getAll() {
    let request = new IdbRequest(this.store.getAll());
    return request.promisify();
  }

  /**
   * index get index in the store with a given name
   * @param  {string} name name of index to retrieve
   * @return {Index} the index desired
   */
  index(name) {
    let index = new Index(this.store.index(name));
    return index;
  }

  /**
   * delete value with provided key
   * @param  {IDBValidKey} key key of record desired to be deleted
   * @return {Promise<undefined>} Promise that resolves on deletion or rejects on error
   */
  delete(key) {
    let request = new IdbRequest(this.store.delete(key));
    return request.promisify();
  }

  /**
   * clear removes all records from the store
   * @return {Promise<undefined>} Promise that resolves on clear or rejects on error
   */
  clear() {
    let request = new IdbRequest(this.store.clear());
    return request.promisify();
  }
}

/**
 * Index IDBIndex wrapper
 */
export class Index {
  /**
   * constructor IDBIndex wrapper
   * @param {IDBIndex} index the IDBIndex being wrapped
   */
  constructor(index) {
    this.index = index;
  }

  /**
   * cursor gets the cursor of the index and calls the callback on success
   * @param {CursorCallback<IDBCursorWithValue>} callback callback called when cursor onsuccess event is fired
   * @param {(IDBValidKey | IDBKeyRange)?} [query] query for the cursor
   * @param {IDBCursorDirection} [direction] cursor direction
   * @return {Promise<IDBCursorWithValue>} Promise that resolves when cursor has no more records or rejects on error
   */
  open_cursor(callback, query = undefined, direction = undefined) {
    let cursor = new Cursor(this.index.openCursor(query, direction), callback);
    return cursor.promisify();
  }

  /**
   *
   *
   * @param {CursorCallback<IDBCursor>} callback callback called when cursor onsuccess event is fired
   * @param {(IDBValidKey | IDBKeyRange)?} [query] query for the cursor
   * @return {Promise<IDBCursor>} Promise that resolves when cursor has no more records or rejects on error
   */
  open_key_cursor(callback, query = undefined) {
    let cursor = new Cursor(this.index.openKeyCursor(query), callback);
    return cursor.promisify();
  }
}

/**
 * Cursor is a wrapper around a IDBCursor
 * @template {IDBCursor | IDBCursorWithValue} T
 */
export class Cursor {
  /**
   * constructor a wrapper around a IDBCursor
   * @param {IDBRequest<T?>} cursorRequest the IDBCursor being wrapped
   * @param {CursorCallback<T>} callback callback called when cursor onsuccess event is fired
   */
  constructor(cursorRequest, callback) {
    this.request = cursorRequest;
    this.callback = callback;
  }

  /**
   * promisify turns the IDBCursor into a promise
   * @return {Promise<T>} Promise that resolves when cursor has no more records or rejects on error
   */
  promisify() {
    return new Promise((resolve, reject) => {
      this.request.onsuccess = (event) => {
        if (this.request.result) {
          if (this.callback) this.callback(this.request.result);
          resolve(this.request.result);
        } else {
          reject(new Error("Cursor:Promisify:OnSuccess - NO RESULT"));
        }
      };

      this.request.onerror = (event) => {
        reject(event);
      };
    });
  }
}

/**
 * IdbRequest wrapper around an IDBRequest
 * @template T
 */
export class IdbRequest {
  /**
   * constructor wrapper around an IDBRequest
   * @param {IDBRequest<T>} request IDBRequest being wrapped
   */
  constructor(request) {
    this.request = request;
  }

  /**
   * promisify turns the IdbRequest into a promise
   * @return {Promise<T>} Promise that resolves on success or rejects on error
   */
  promisify() {
    return new Promise((resolve, reject) => {
      this.request.onsuccess = (event) => {
        if (this.request.result) {
          resolve(this.request.result);
        } else {
          reject(new Error("IdbRequest:Promisify:OnSuccess - NO RESULT"));
        }
      };
      this.request.onerror = (event) => {
        reject(event);
      };
    });
  }
}
