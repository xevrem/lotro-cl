
function create_store(starting_state={}){
    window.simple_state_store = new Store(starting_state);
    return window.simple_state_store;
}

function get_store(){
    if(window.simple_state_store){
        return window.simple_state_store;
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
        let update_state = this._update_state.bind(this);
            new Promise((resolve,reject)=>{
            resolve(update_state(data));
        })
        .then(store=>{
            if(store.listeners.hasOwnProperty(action)){
                store.listeners[action].forEach(callback=>{
                    callback(store.state, action);
                });
            }
        }).catch(error=>{
            console.log('something broke during action issue:',error);
        });
        
        //OLD WAY
        // this._update_state(data);
        // if(this.listeners.hasOwnProperty(action)){
        //     this.listeners[action].forEach(callback=>{
        //         callback(this.state, action);
        //     });
        // }
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
        return this;
    }
}

export {create_store, get_store, Store};