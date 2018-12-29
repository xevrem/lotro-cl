import {get_url} from 'utils/urls';

export const CHARACTERS_LOADED = 'characters/LOADED';
export const CHARACTER_ADDED = 'character/ADD';
export const CHARACTER_DELETED = 'character/DELETE';
export const CHARACTER_SELECTED = 'character/SELECT';
export const CHARACTER_UPDATED = 'character/UPDATE';


const initial_state = {
  characters:[],
  character_selected:-1
};



export default {
  namespaced:true,
  state:{
    ...initial_state
  },
  mutations:{
    [CHARACTERS_LOADED](state, payload){
      state.characters = payload;
    },
    [CHARACTER_ADDED](state, payload){},
    [CHARACTER_DELETED](state, payload){},
    [CHARACTER_SELECTED](state, payload){},
    [CHARACTER_UPDATED](state, payload){}
  },
  actions:{
    fetch_characters({dispatch, commit}){
      return dispatch('api/get',{
        url:  get_url('characters'),
        options:{
          mode:'cors',
          credentials:'include'
        }
      },
      {root:true}).then( data =>{
        commit(CHARACTERS_LOADED, data);
      });
    }
  },
  getters:{

  }
};
