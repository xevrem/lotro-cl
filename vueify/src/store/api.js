
import {ACTION_TYPES} from 'utils/constants';
import {get_url} from 'utils/urls';

const initial_state = {
  
};

export default {
  namespaced:true,
  state:{
    ...initial_state
  },
  // mutations:{

  // },
  actions:{
    fetch_deeds(){
      let local_url = get_url('deeds');
      return fetch(local_url,{
        mode:'cors',
        credentials:'include',
      }).then( response => {
        return response.json();
      }).then( json => {
        return json;
      }).catch(error => console.log(error));
    },
    fetch_characters(){
      return fetch(get_url('characters'),{
        mode:'cors',
        credentials:'include',
      }).then( response => {
        return response.json();
      }).then( json => {
        return json;
      }).catch(error => console.log(error));
    }
  },
  // getters:{

  // }
};
