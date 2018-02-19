
function create_store(starting_state={}){
    window.store = new Store(starting_state);
    return window.store;
}

function get_store(){
    if(window.store){
        return window.store;
    }else{
        throw new Error('No Store Exists!');
    }
}

class Store{

    constructor(starting_state={}){
        this.state = starting_state;
        this.subscribers = {}
        this.listeners = {}
    }

    subscribe(action, listener){
        if(this.listeners.hasOwnProperty(action)){
            this.listeners[action].push(listener);
        }else{
            this.listeners[action] = [listener];
        }
    }

    issue_action(action, data){
        this._update_state(data);
        if(this.listeners.hasOwnProperty(action)){
            this.listeners[action].forEach(callback=>{
                callback(this.state, action);
            });
        }
    }

    unsubscribe(){

    }

    get_state(){
        return this.state;
    }

    _update_state(update){
        let keys = Object.keys(update);
        for(let key of keys){
            this.state[key] = update[key];
        }
    }
}

export {create_store, get_store, Store};