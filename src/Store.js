
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
    }

    subscribe(action, listener){

    }

    issue_action(action, data){

    }

    unsubscribe(){

    }

    get_state(){
        return this.state;
    }

    update_state(update){
        this.state = update;
    }
}

export {create_store, get_store, Store};