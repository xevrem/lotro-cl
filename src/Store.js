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

/**
 * @template {Record<string, any>} State
 * @typedef {Object} StoreOnWindow
 * @property {Store<State>} [simple_state_store]
 */

/**
 * @template {Record<string, any>} State
 * @typedef {Window & typeof globalThis & StoreOnWindow<State>} WindowWithStore
 */

/**
 *
 * @template ActionData
 * @typedef {object} Action
 * @property {string} action
 * @property {ActionData} data
 */

/**
 * @template {Record<string, any>} State
 * @function
 * @typedef StoreListener
 * @type {(state: State, update: Partial<State>)=> void}
 */

/**
 *
 * @template {Record<string, any>} State
 * @param {any} [starting_state={}]
 * @param {number} [dispatch_interval=1000]
 * @param {number} [dispatch_limit=-1]
 * @returns {Store<State>}
 */
function createStore(
  starting_state = {},
  dispatch_interval = 1000,
  dispatch_limit = -1
) {
  /** @type {WindowWithStore<State>}*/
  const win = window;
  win.simple_state_store = new Store(
    starting_state,
    dispatch_interval,
    dispatch_limit
  );
  return win.simple_state_store;
}

/**
 *
 * @template {Record<string, any>} State
 * @returns {Store<State>}
 * @throws {Error}
 */
function getStore() {
  /** @type {WindowWithStore<State>}*/
  const win = window;
  if (win.simple_state_store) {
    return win.simple_state_store;
  } else {
    throw new Error("No Store Exists!");
  }
}

/**
 * @template {Record<string, any>} State
 */
class Store {
  /** @type {Array<Action<Partial<State>>>}*/
  dispatch_queue;
  /** @type {Record<string, Array<StoreListener<State>>>}*/
  listeners;
  /** @type {State}*/
  state;

  /**
   *
   *
   * @param {State} starting_state
   * @param {number} [dispatch_interval=60]
   * @param {*} [dispatch_limit=-1]
   */
  constructor(starting_state, dispatch_interval = 60, dispatch_limit = -1) {
    this.state = starting_state;
    this.subscribers = {};
    this.listeners = {};
    this.dispatch_queue = new Array();
    this.dispatch_interval = dispatch_interval;
    this.dispatch_limit = dispatch_limit;
    this.is_dispatching = false;
    this.dispatcher = this.dispatcher.bind(this);
    this.dispatcher_id = setTimeout(this.dispatcher, this.dispatch_interval);
  }

  /**
   *
   * @param {string} action
   * @param {StoreListener<State>} listener
   * @returns {Function} unsubscription function
   */
  subscribe(action, listener) {
    if (action in this.listeners) {
      this.listeners[action].push(listener);
    } else {
      this.listeners[action] = [listener];
    }

    return () => {
      this.listeners[action] = this.listeners[action].filter((callback) => {
        return callback !== listener;
      });
    };
  }

  /**
   *
   * @template ActionData
   * @param {string} action
   * @param {Partial<State>} data
   */
  issueAction(action, data) {
    this.dispatch_queue.push({ action: action, data: data });
    if (!this.is_dispatching) {
      //issue a new dispatch if not currently dispatching
      this.dispatcher();
    } else {
      console.log("dispatcher busy...");
    }
  }

  getState() {
    return this.state;
  }

  /**
   * update the state
   *
   * @param {Partial<State>} update
   * @returns {Store<State>}
   */
  updateState(update) {
    const keys = Object.keys(update);
    for (const key of keys) {
      this.state = {
        ...this.state,
        [key]: update[key],
      };
    }
    return this;
  }

  dispatch() {}

  dispatcher() {
    // console.log('dispatching...', this.dispatch_queue.length, this.dispatch_queue);

    this.is_dispatching = true;

    let start = Date.now();

    if (this.dispatch_limit > 0) {
      // dispatch limited number
      for (let i = 0; i < this.dispatch_limit; i++) {
        if (this.dispatch_queue.length > 0) {
          // pull item from front
          let cmd = this.dispatch_queue.shift();
          if (cmd) {
            let store = this.updateState(cmd.data);

            // issue callbacks
            if (cmd.action in store.listeners) {
              store.listeners[cmd.action].forEach((callback) => {
                // because tsc lang server is dumb, we have to re-verify cmd here
                cmd && callback(store.state, cmd.data);
              });
            }
          }
        } else {
          break; //break loop early since there is nothing to do
        }
      }
    } else {
      //dispatch all
      while (this.dispatch_queue.length > 0) {
        //pull item from front
        let cmd = this.dispatch_queue.shift();
        if (cmd) {
          let store = this.updateState(cmd.data);

          //issue callbacks
          if (cmd.action in store.listeners) {
            store.listeners[cmd.action].forEach((callback) => {
              // because tsc lang server is dumb, we have to re-verify cmd here
              cmd && callback(store.state, cmd.data);
            });
          }
        }
      }
    }

    let finish = Date.now();

    let elapsed = finish - start;

    //dispatch more as needed
    if (this.dispatch_queue.length > 0) {
      if (elapsed > this.dispatch_interval) {
        // console.log('exceeded interval time...');
        //exceeded interval time, immediately dispatch
        this.dispatcher();
      } else {
        // console.log('dispatching again in:', this.dispatch_interval-elapsed);
        //dispatch in standard not to exceed interval time
        setTimeout(this.dispatcher, this.dispatch_interval - elapsed);
      }
    }

    this.is_dispatching = false;
  }
}

export { createStore, getStore, Store };
